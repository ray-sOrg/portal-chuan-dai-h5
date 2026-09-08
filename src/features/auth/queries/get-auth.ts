import { cookies } from "next/headers";
import { cache } from "react";

import { lucia } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";
import { renewCentralSession } from "@/lib/central-session";

export const getAuth = cache(async () => {
  const _cookie = await cookies();

  const sessionId = _cookie.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  if (result.session) {
    const stored = await prisma.session.findUnique({where: {id: sessionId}, include: {user: {select: {oidcSubject: true}}}});
    if (!stored || (stored.user.oidcSubject && !stored.oidcSid)) return {user: null, session: null};
    if (process.env.OIDC_SESSION_ENFORCED === "true") {
      if (!stored.oidcRefreshToken || !stored.oidcSid) return {user: null, session: null};
      if (!stored.oidcCheckedAt || Date.now() - stored.oidcCheckedAt.getTime() >= 60000) {
        const next = await renewCentralSession(stored.oidcRefreshToken);
        const where = {id: stored.id, oidcRefreshToken: stored.oidcRefreshToken};
        if (!next) { await prisma.session.deleteMany({where}); return {user: null, session: null}; }
        const updated = await prisma.session.updateMany({where, data: {oidcRefreshToken: next, oidcCheckedAt: new Date()}});
        if (!updated.count) {
          const latest = await prisma.session.findUnique({where: {id: stored.id}});
          if (!latest?.oidcCheckedAt || Date.now() - latest.oidcCheckedAt.getTime() >= 60000) return {user: null, session: null};
        }
      }
    }
  }

  // 注意：在 RSC 中无法修改 Cookie，所以这里只读取不修改
  // Cookie 刷新应该在 middleware 或 Server Action 中处理

  return result;
});
