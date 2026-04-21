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
    <section className="card-base overflow-hidden p-6">
      <div className="relative overflow-hidden rounded-[calc(var(--radius)+0.25rem)] border border-white/40 bg-[linear-gradient(145deg,var(--hero-start),var(--hero-end))] p-5 shadow-[var(--shadow-soft)]">
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/25 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 left-12 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.7rem] border border-white/55 bg-white/55 shadow-[var(--shadow-soft)]">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.nickname || ""}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/55 bg-white/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                  Flavor Archive
                </span>
                <span className="rounded-full border border-white/55 bg-white/40 px-3 py-1 text-xs text-foreground/80">
                  @{profile.account}
                </span>
                {genderText && (
                  <span className="rounded-full border border-white/55 bg-white/40 px-3 py-1 text-xs text-foreground/80">
                    {genderText}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-semibold">
                {profile.nickname || profile.account}
              </h2>
              <p className="mt-1 max-w-xl text-sm text-foreground/70">
                {profile.bio || t("auth.bioPlaceholder")}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="surface-chip rounded-[1.15rem] px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Theme
              </div>
              <div className="mt-1 font-medium text-foreground">Chuan-Dai</div>
            </div>
            <div className="surface-chip rounded-[1.15rem] px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Account
              </div>
              <div className="mt-1 truncate font-medium text-foreground">
                {profile.account}
              </div>
            </div>
            <div className="surface-chip rounded-[1.15rem] px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Profile
              </div>
              <div className="mt-1 font-medium text-foreground">
                {isEditing ? t("profile.editProfile") : "Ready"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-5 rounded-[calc(var(--radius)+0.2rem)] border border-border/80 bg-[var(--surface-soft)] p-4 shadow-[var(--shadow-soft)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium">{t("profile.editProfile")}</h3>
            <button
              onClick={() => setIsEditing(false)}
              className="surface-chip rounded-full p-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <X className="h-5 w-5" />
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
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
        >
          {t("profile.editProfile")}
        </button>
      )}
    </section>
  );
}
