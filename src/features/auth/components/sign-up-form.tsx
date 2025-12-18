"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { FieldError, Form, SubmitButton } from "@/components/form";
import { Link } from "@/i18n/routing";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { signInPath } from "@/paths";

import { signUp } from "../actions/sign-up";

export function SignUpForm() {
    const t = useTranslations("auth");
    const [actionState, action] = useActionState(signUp, EMPTY_ACTION_STATE);

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
                    maxLength={20}
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

            <div>
                <input
                    name="confirmPassword"
                    type="password"
                    placeholder={t("confirmPasswordPlaceholder")}
                    defaultValue={actionState.payload?.get("confirmPassword") as string}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <FieldError name="confirmPassword" actionState={actionState} />
            </div>

            <SubmitButton label={t("signUp")} className="w-full" />

            <p className="text-center text-sm text-muted-foreground">
                {t("hasAccount")}{" "}
                <Link href={signInPath} className="text-primary hover:underline">
                    {t("signIn")}
                </Link>
            </p>
        </Form>
    );
}
