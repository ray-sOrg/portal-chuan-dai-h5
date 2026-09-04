import { NextRequest, NextResponse } from "next/server";
import * as oidc from "openid-client";
import { lucia } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";
import { appUrl, oidcConfig, OIDC_ATTEMPT_COOKIE, OIDC_CALLBACK_PATH, OIDC_STATE_COOKIE, secureCookie } from "@/lib/oidc";

export async function GET(request: NextRequest) {
  const state = request.cookies.get(OIDC_STATE_COOKIE)?.value;
  const attempt = request.cookies.get(OIDC_ATTEMPT_COOKIE)?.value;
  if (!state || !attempt || request.nextUrl.searchParams.get("state") !== state) return new NextResponse("登录状态无效，请重新登录。", { status: 400 });
  const [codeVerifier, nonce, encodedReturnTo] = attempt.split("|");
  try {
    const config = await oidcConfig();
    const callbackUrl = new URL(`${appUrl()}${OIDC_CALLBACK_PATH}`); callbackUrl.search = request.nextUrl.search;
    const tokens = await oidc.authorizationCodeGrant(config, callbackUrl, { pkceCodeVerifier: codeVerifier, expectedState: state, expectedNonce: nonce, idTokenExpected: true });
    const claims = tokens.claims();
    if (!claims?.sub) return new NextResponse("统一登录账号无效。", { status: 403 });
    const user = await prisma.user.findUnique({ where: { oidcSubject: claims.sub } });
    if (!user) return NextResponse.redirect(new URL("/zh/sign-in?error=未绑定统一账号", appUrl()));
    const session = await lucia.createSession(user.id, {});
    const response = NextResponse.redirect(new URL(decodeURIComponent(encodedReturnTo || "/zh/home"), appUrl()));
    const cookie = lucia.createSessionCookie(session.id); response.cookies.set(cookie.name, cookie.value, cookie.attributes);
    const clear = { httpOnly: true, secure: secureCookie(), sameSite: "lax" as const, path: OIDC_CALLBACK_PATH, maxAge: 0 };
    response.cookies.set(OIDC_STATE_COOKIE, "", clear); response.cookies.set(OIDC_ATTEMPT_COOKIE, "", clear);
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return response;
  } catch { return new NextResponse("统一登录失败，请重试。", { status: 400 }); }
}
