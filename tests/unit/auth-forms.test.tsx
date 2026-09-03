import type { ReactNode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { toActionState } from "@/components/form/utils/to-action-state";
import { signIn } from "@/features/auth/actions/sign-in";
import { signUp } from "@/features/auth/actions/sign-up";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

vi.mock("@/features/auth/actions/sign-in", () => ({ signIn: vi.fn() }));
vi.mock("@/features/auth/actions/sign-up", () => ({ signUp: vi.fn() }));
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));
vi.mock("@/i18n/routing", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("auth form action responses", () => {
  it.each([
    { name: "sign in", Component: SignInForm, action: signIn },
    { name: "sign up", Component: SignUpForm, action: signUp },
  ])("keeps $name usable after a serialized error response", async ({ Component, action }) => {
    const formData = new FormData();
    formData.set("account", "user01");
    formData.set("password", "Passw0rd");
    const state = toActionState("ERROR", "", formData);
    state.fieldError = { account: ["账号校验失败"] };
    vi.mocked(action).mockResolvedValue(JSON.parse(JSON.stringify(state)));

    render(<Component />);
    const account = screen.getByPlaceholderText("accountPlaceholder");
    fireEvent.change(account, { target: { value: "user01" } });
    fireEvent.change(screen.getByPlaceholderText("passwordPlaceholder"), {
      target: { value: "Passw0rd" },
    });
    fireEvent.submit(account.closest("form")!);

    expect(await screen.findByText("账号校验失败")).toBeVisible();
    expect(account).toHaveValue("user01");
    expect(screen.getByRole("button")).toBeEnabled();
    expect(screen.getByPlaceholderText("passwordPlaceholder")).toHaveValue("");
  });
});
