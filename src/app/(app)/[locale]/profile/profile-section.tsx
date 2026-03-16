"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { User, X } from "lucide-react";

import { ProfileForm } from "@/features/auth/components";

type Profile = {
    id: string;
    account: string;
    nickname: string | null;
    avatar: string | null;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    birthday: Date | null;
    bio: string | null;
};

export function ProfileSection({ profile }: { profile: Profile }) {
    const t = useTranslations();
    const [isEditing, setIsEditing] = useState(false);

    const genderText = profile.gender
        ? { MALE: t("auth.male"), FEMALE: t("auth.female"), OTHER: t("auth.other") }[
        profile.gender
        ]
        : null;

    return (
        <section className="card-base p-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                    {profile.avatar ? (
                        <img
                            src={profile.avatar}
                            alt={profile.nickname || ""}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-8 h-8 text-primary" />
                    )}
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-semibold">
                        {profile.nickname || profile.account}
                    </h2>
                    <p className="text-muted-foreground">{profile.account}</p>
                    {genderText && (
                        <p className="text-sm text-muted-foreground">{genderText}</p>
                    )}
                </div>
            </div>

            {profile.bio && (
                <p className="text-sm text-muted-foreground mb-4">{profile.bio}</p>
            )}

            {isEditing ? (
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">{t("profile.editProfile")}</h3>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="p-1 hover:bg-muted rounded"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <ProfileForm
                        initialData={{
                            nickname: profile.nickname,
                            gender: profile.gender,
                            birthday: profile.birthday,
                            bio: profile.bio,
                        }}
                    />
                </div>
            ) : (
                <button
                    onClick={() => setIsEditing(true)}
                    className="w-full border border-border rounded-lg py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                    {t("profile.editProfile")}
                </button>
            )}
        </section>
    );
}
