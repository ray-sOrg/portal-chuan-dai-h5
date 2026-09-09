import { describe, expect, it } from "vitest";

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

describe("action payload sanitizing", () => {
  it("removes secrets while retaining safe fields", () => {
    const formData = new FormData();
    formData.set("account", "user01");
    formData.set("password", "Passw0rd");
    formData.set("confirmNewPassword", "Passw0rd");
    formData.set("code", "123456");
    formData.set("csrfToken", "secret");

    const sanitized = sanitizeActionPayload(formData);

    expect(sanitized).toEqual({ account: "user01" });
    expect(toActionState("ERROR", "failed", formData).payload?.password)
      .toBeUndefined();
  });

  it("preserves text fields after serialization without returning files or secrets", () => {
    const formData = new FormData();
    formData.set("account", "user01");
    formData.set("password", "Passw0rd");
    formData.set("avatar", new File(["image"], "avatar.png"));

    const state = JSON.parse(JSON.stringify(toActionState("ERROR", "failed", formData)));

    expect(state.payload).toEqual({ account: "user01" });
    expect(sanitizeActionPayload()).toBeUndefined();
  });

  it("does not expose internal error messages", () => {
    const state = formErrorToActionState(
      new Error("database connection string leaked")
    );

    expect(state.message).toBe("操作失败，请稍后重试");
    expect(state.message).not.toContain("database");
  });
});
