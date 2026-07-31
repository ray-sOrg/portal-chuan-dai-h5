import { afterEach, describe, expect, it, vi } from "vitest";

import {
  accountSchema,
  signInPasswordSchema,
  strongPasswordSchema,
} from "@/features/auth/auth-rules";
import { isDevOtpEnabled } from "@/features/auth/utils/dev-otp";
import { getClientIp } from "@/features/auth/utils/login-rate-limit";
import { getSafeRedirectPath } from "@/features/auth/utils/safe-redirect";
import {
  formErrorToActionState,
  sanitizeActionPayload,
  toActionState,
} from "@/components/form/utils/to-action-state";

describe("getSafeRedirectPath", () => {
  it.each([
    "https://evil.example/path",
    "//evil.example/path",
    "/\\evil.example/path",
    "javascript:alert(1)",
    "",
  ])("rejects unsafe redirect %s", (redirectTo) => {
    expect(getSafeRedirectPath(redirectTo, "/zh/profile")).toBe(
      "/zh/profile"
    );
  });

  it("preserves a same-origin path, query, and hash", () => {
    expect(getSafeRedirectPath("/zh/orders?id=1#details")).toBe(
      "/zh/orders?id=1#details"
    );
  });
});

describe("authentication validation", () => {
  it("requires strong passwords for registration and password changes", () => {
    expect(strongPasswordSchema.safeParse("password").success).toBe(false);
    expect(strongPasswordSchema.safeParse("12345678").success).toBe(false);
    expect(strongPasswordSchema.safeParse("Passw0").success).toBe(true);
  });

  it("keeps legacy passwords valid for sign in", () => {
    expect(signInPasswordSchema.safeParse("old").success).toBe(true);
  });

  it("rejects malformed accounts", () => {
    expect(accountSchema.safeParse("a b").success).toBe(false);
    expect(accountSchema.safeParse("user01").success).toBe(true);
  });
});

describe("action payload sanitizing", () => {
  it("removes secrets while retaining safe fields", () => {
    const formData = new FormData();
    formData.set("account", "user01");
    formData.set("password", "Passw0rd");
    formData.set("confirmNewPassword", "Passw0rd");
    formData.set("code", "123456");
    formData.set("csrfToken", "secret");

    const sanitized = sanitizeActionPayload(formData);

    expect(sanitized?.get("account")).toBe("user01");
    expect(Array.from(sanitized?.keys() ?? [])).toEqual(["account"]);
    expect(toActionState("ERROR", "failed", formData).payload?.get("password"))
      .toBeNull();
  });

  it("does not expose internal error messages", () => {
    const state = formErrorToActionState(
      new Error("database connection string leaked")
    );

    expect(state.message).toBe("操作失败，请稍后重试");
    expect(state.message).not.toContain("database");
  });
});

describe("client IP parsing", () => {
  it("uses the first valid forwarded IP", () => {
    const requestHeaders = new Headers({
      "x-forwarded-for": "203.0.113.8, 10.0.0.1",
    });

    expect(getClientIp(requestHeaders)).toBe("203.0.113.8");
  });

  it("rejects malformed IP headers", () => {
    expect(
      getClientIp(new Headers({ "x-forwarded-for": "not-an-ip" }))
    ).toBe("unknown");
  });
});

describe("development OTP guard", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("requires both a non-production environment and an explicit flag", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("ENABLE_DEV_OTP", "");
    expect(isDevOtpEnabled()).toBe(false);

    vi.stubEnv("ENABLE_DEV_OTP", "true");
    expect(isDevOtpEnabled()).toBe(true);

    vi.stubEnv("NODE_ENV", "production");
    expect(isDevOtpEnabled()).toBe(false);
  });
});
