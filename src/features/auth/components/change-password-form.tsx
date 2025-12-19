"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { FieldError, Form, SubmitButton } from "@/components/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";

import { changePassword } from "../actions/change-password";

export function ChangePasswordForm() {
    const t = useTranslations("auth");
    const [actionState, action] = useActionState(changePassword, EMPTY_ACTION_STATE);

    return (
        <Form
            action={action}
            actionState={actionState}
            className="flex flex-col gap-y-4"
        >
            <div>
                <input
                    name="currentPassword"
                    type="password"
                    maxLength={16}
                    placeholder={t("currentPassword")}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <FieldError name="currentPassword" actionState={actionState} />
            </div>

            <div>
                <input
                    name="newPassword"
                    type="password"
                    maxLength={16}
                    placeholder={t("newPassword")}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-1">{t("passwordRule")}</p>
                <FieldError name="newPassword" actionState={actionState} />
            </div>

            <div>
                <input
                    name="confirmNewPassword"
                    type="password"
                    maxLength={16}
                    placeholder={t("confirmNewPassword")}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <FieldError name="confirmNewPassword" actionState={actionState} />
            </div>

            <SubmitButton label={t("changePassword")} className="w-full" />
        </Form>
    );
}
