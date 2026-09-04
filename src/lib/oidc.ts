import "server-only";
import * as oidc from "openid-client";

const issuer = process.env.OIDC_ISSUER ?? "https://auth.tt829.cn/realms/tt829";
function required(name: string) { const value = process.env[name]; if (!value) throw new Error(`${name} is required`); return value; }
export const OIDC_CALLBACK_PATH = "/api/auth/oidc/callback";
export const OIDC_STATE_COOKIE = "chuan_oidc_state";
export const OIDC_ATTEMPT_COOKIE = "chuan_oidc_attempt";
export function appUrl() { return required("APP_URL").replace(/\/$/, ""); }
let configuration: Promise<oidc.Configuration> | undefined;
export function oidcConfig() {
  configuration ??= oidc.discovery(new URL(issuer), required("OIDC_CLIENT_ID"), required("OIDC_CLIENT_SECRET"));
  return configuration;
}
export function secureCookie() { return appUrl().startsWith("https://"); }
