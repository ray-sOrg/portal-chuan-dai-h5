import { cookies } from "next/headers";
import { cache } from "react";

import { lucia } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";

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
  }

  // 注意：在 RSC 中无法修改 Cookie，所以这里只读取不修改
  // Cookie 刷新应该在 middleware 或 Server Action 中处理

  return result;
});
