import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SignInForm } from "@/features/auth/components/sign-in-form";

afterEach(() => {
  cleanup();
});

describe("unified sign in", () => {
  it("exposes only the central login action and preserves the return path", () => {
    render(<SignInForm redirectTo="/zh/orders?tab=open" />);

    expect(screen.getByRole("link", { name: "使用统一账号登录" })).toHaveAttribute(
      "href",
      "/api/auth/oidc/login?returnTo=%2Fzh%2Forders%3Ftab%3Dopen"
    );
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(document.querySelector('input[type="password"]')).toBeNull();
    expect(screen.queryByRole("link", { name: "注册" })).not.toBeInTheDocument();
  });
});
