import { createHash } from "node:crypto";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const PHOTO_UPLOAD_QUOTAS = [
  { scope: "photo-upload-hour", maxAttempts: 30, windowMinutes: 60 },
  { scope: "photo-upload-day", maxAttempts: 200, windowMinutes: 24 * 60 },
] as const;

interface QuotaRow {
  attempts: number;
  windowStartedAt: Date;
}

export class PhotoUploadQuotaExceededError extends Error {
  readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super("Photo upload quota exceeded");
    this.name = "PhotoUploadQuotaExceededError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

const createQuotaKey = (scope: string, userId: string) =>
  createHash("sha256").update(`${scope}:${userId}`).digest("hex");

const consumeQuota = async (
  transaction: Prisma.TransactionClient,
  userId: string,
  quota: (typeof PHOTO_UPLOAD_QUOTAS)[number]
) => {
  const key = createQuotaKey(quota.scope, userId);
  const rows = await transaction.$queryRaw<QuotaRow[]>(Prisma.sql`
    INSERT INTO "AuthRateLimit"
      ("key", "attempts", "windowStartedAt", "blockedUntil", "updatedAt")
    VALUES
      (${key}, 1, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP)
    ON CONFLICT ("key") DO UPDATE SET
      "attempts" = CASE
        WHEN "AuthRateLimit"."windowStartedAt" <=
          CURRENT_TIMESTAMP - make_interval(
            mins => CAST(${quota.windowMinutes} AS integer)
          )
          THEN 1
        ELSE "AuthRateLimit"."attempts" + 1
      END,
      "windowStartedAt" = CASE
        WHEN "AuthRateLimit"."windowStartedAt" <=
          CURRENT_TIMESTAMP - make_interval(
            mins => CAST(${quota.windowMinutes} AS integer)
          )
          THEN CURRENT_TIMESTAMP
        ELSE "AuthRateLimit"."windowStartedAt"
      END,
      "blockedUntil" = NULL,
      "updatedAt" = CURRENT_TIMESTAMP
    RETURNING "attempts", "windowStartedAt"
  `);
  const row = rows[0];

  if (row.attempts > quota.maxAttempts) {
    const resetAt =
      row.windowStartedAt.getTime() + quota.windowMinutes * 60 * 1000;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((resetAt - Date.now()) / 1000)
    );
    throw new PhotoUploadQuotaExceededError(retryAfterSeconds);
  }
};

export const consumePhotoUploadQuota = (userId: string) =>
  prisma.$transaction(async (transaction) => {
    for (const quota of PHOTO_UPLOAD_QUOTAS) {
      await consumeQuota(transaction, userId, quota);
    }
  });
