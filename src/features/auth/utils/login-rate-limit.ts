import { createHash } from "node:crypto";
import { isIP } from "node:net";

import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 5;

const createRateLimitKey = (scope: "account" | "ip", value: string) =>
  createHash("sha256")
    .update(`${scope}:${value.toLowerCase()}`)
    .digest("hex");

const getRateLimitKeys = (account: string, clientIp: string) => {
  const keys = [createRateLimitKey("account", account)];

  if (clientIp !== "unknown") {
    keys.push(createRateLimitKey("ip", clientIp));
  }

  return keys;
};

export const getClientIp = (requestHeaders: Headers) => {
  const forwardedIp = requestHeaders
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const candidate = forwardedIp || requestHeaders.get("x-real-ip")?.trim();

  return candidate && isIP(candidate) ? candidate : "unknown";
};

export const isSignInRateLimited = async (
  account: string,
  clientIp: string
) => {
  const blockedEntry = await prisma.authRateLimit.findFirst({
    where: {
      key: { in: getRateLimitKeys(account, clientIp) },
      blockedUntil: { gt: new Date() },
    },
    select: { key: true },
  });

  return Boolean(blockedEntry);
};

export const recordFailedSignIn = async (
  account: string,
  clientIp: string
) => {
  const keys = getRateLimitKeys(account, clientIp);

  await prisma.$transaction(
    keys.map((key) =>
      prisma.$executeRaw`
        INSERT INTO "AuthRateLimit"
          ("key", "attempts", "windowStartedAt", "blockedUntil", "updatedAt")
        VALUES
          (${key}, 1, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP)
        ON CONFLICT ("key") DO UPDATE SET
          "attempts" = CASE
            WHEN "AuthRateLimit"."windowStartedAt" <= CURRENT_TIMESTAMP - INTERVAL '15 minutes'
              THEN 1
            ELSE "AuthRateLimit"."attempts" + 1
          END,
          "windowStartedAt" = CASE
            WHEN "AuthRateLimit"."windowStartedAt" <= CURRENT_TIMESTAMP - INTERVAL '15 minutes'
              THEN CURRENT_TIMESTAMP
            ELSE "AuthRateLimit"."windowStartedAt"
          END,
          "blockedUntil" = CASE
            WHEN "AuthRateLimit"."blockedUntil" > CURRENT_TIMESTAMP
              THEN "AuthRateLimit"."blockedUntil"
            WHEN "AuthRateLimit"."windowStartedAt" <= CURRENT_TIMESTAMP - INTERVAL '15 minutes'
              THEN NULL
            WHEN "AuthRateLimit"."attempts" + 1 >= ${MAX_ATTEMPTS}
              THEN CURRENT_TIMESTAMP + INTERVAL '15 minutes'
            ELSE NULL
          END,
          "updatedAt" = CURRENT_TIMESTAMP
      `
    )
  );
};

export const clearAccountSignInFailures = async (account: string) => {
  await prisma.authRateLimit.deleteMany({
    where: { key: createRateLimitKey("account", account) },
  });
};
