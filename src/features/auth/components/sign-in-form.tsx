"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { FieldError, Form, SubmitButton } from "@/components/form";
import { Link } from "@/i18n/routing";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { signUpPath } from "@/paths";

import { signIn } from "../actions/sign-in";

interface SignInFormProps {
    redirectTo?: string;
}

export function SignInForm({ redirectTo = '/profile' }: SignInFormProps) {
    const t = useTranslations("auth");

    // 绑定 redirectTo 参数到 signIn action
    const signInWithRedirect = signIn.bind(null, redirectTo);
    const [actionState, action] = useActionState(signInWithRedirect, EMPTY_ACTION_STATE);

    return (
        <Form
            action={action}
            actionState={actionState}
            className="flex flex-col gap-y-4"
        >
            <div>
                <input
                    name="account"
                    type="text"
                    placeholder={t("accountPlaceholder")}
                    defaultValue={actionState.payload?.get("account") as string}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <FieldError name="account" actionState={actionState} />
            </div>

            <div>
                <input
                    name="password"
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    defaultValue={actionState.payload?.get("password") as string}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <FieldError name="password" actionState={actionState} />
            </div>

            <SubmitButton label={t("signIn")} className="w-full" />

            <div className="flex items-center justify-between text-sm">
                <Link href="/forgot-password" className="text-muted-foreground hover:text-primary">
                    {t("forgotPassword")}
                </Link>
                <p className="text-muted-foreground">
                    {t("noAccount")}{" "}
                    <Link href={signUpPath} className="text-primary hover:underline">
                        {t("signUp")}
                    </Link>
                </p>
            </div>
        </Form>
    );
}
