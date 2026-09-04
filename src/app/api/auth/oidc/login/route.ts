import { NextRequest, NextResponse } from "next/server";
import * as oidc from "openid-client";
import { appUrl, oidcConfig, OIDC_ATTEMPT_COOKIE, OIDC_CALLBACK_PATH, OIDC_STATE_COOKIE, secureCookie } from "@/lib/oidc";

export async function GET(request: NextRequest) {
  const config = await oidcConfig();
  const state = oidc.randomState();
  const nonce = oidc.randomNonce();
  const codeVerifier = oidc.randomPKCECodeVerifier();
  const codeChallenge = await oidc.calculatePKCECodeChallenge(codeVerifier);
  const requested = request.nextUrl.searchParams.get("returnTo");
  const returnTo = requested?.startsWith("/") ? requested : "/zh/home";
  const authorizationUrl = oidc.buildAuthorizationUrl(config, { redirect_uri: `${appUrl()}${OIDC_CALLBACK_PATH}`, scope: "openid profile email", response_type: "code", code_challenge: codeChallenge, code_challenge_method: "S256", state, nonce });
  const response = NextResponse.redirect(authorizationUrl);
  const options = { httpOnly: true, secure: secureCookie(), sameSite: "lax" as const, path: OIDC_CALLBACK_PATH, maxAge: 600 };
  response.cookies.set(OIDC_STATE_COOKIE, state, options);
  response.cookies.set(OIDC_ATTEMPT_COOKIE, `${codeVerifier}|${nonce}|${encodeURIComponent(returnTo)}`, options);
  return response;
}
