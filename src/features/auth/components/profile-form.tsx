"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { FieldError, Form, SubmitButton } from "@/components/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";

import { updateProfile } from "../actions/update-profile";

type ProfileData = {
    nickname: string | null;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    birthday: Date | null;
    bio: string | null;
};

type Props = {
    initialData: ProfileData;
    onSuccess?: () => void;
};

export function ProfileForm({ initialData, onSuccess }: Props) {
    const t = useTranslations("auth");
    const [actionState, action] = useActionState(updateProfile, EMPTY_ACTION_STATE);

    return (
        <Form
            action={action}
            actionState={actionState}
            className="flex flex-col gap-y-4"
            onSuccess={onSuccess ? () => onSuccess() : undefined}
        >
            <div>
                <label className="block text-sm font-medium mb-1">{t("nickname")}</label>
                <input
                    name="nickname"
                    type="text"
                    maxLength={20}
                    placeholder={t("nicknamePlaceholder")}
                    defaultValue={initialData.nickname || ""}
                    className="themed-input h-11 px-4 text-sm"
                />
                <FieldError name="nickname" actionState={actionState} />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">{t("gender")}</label>
                <select
                    name="gender"
                    defaultValue={initialData.gender || ""}
                    className="themed-select h-11 px-4 text-sm"
                >
                    <option value="">--</option>
                    <option value="MALE">{t("male")}</option>
                    <option value="FEMALE">{t("female")}</option>
                    <option value="OTHER">{t("other")}</option>
                </select>
                <FieldError name="gender" actionState={actionState} />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">{t("birthday")}</label>
                <input
                    name="birthday"
                    type="date"
                    defaultValue={
                        initialData.birthday
                            ? new Date(initialData.birthday).toISOString().split("T")[0]
                            : ""
                    }
                    className="themed-input h-11 px-4 text-sm"
                />
                <FieldError name="birthday" actionState={actionState} />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">{t("bio")}</label>
                <textarea
                    name="bio"
                    maxLength={200}
                    rows={3}
                    placeholder={t("bioPlaceholder")}
                    defaultValue={initialData.bio || ""}
                    className="themed-textarea resize-none px-4 py-3 text-sm"
                />
                <FieldError name="bio" actionState={actionState} />
            </div>

            <SubmitButton label={t("saveProfile")} className="w-full" />
        </Form>
    );
}
