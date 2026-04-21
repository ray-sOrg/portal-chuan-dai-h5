"use client";

import { useTranslations } from "next-intl";
import { LogOut, ChevronRight } from "lucide-react";

import { signOut } from "@/features/auth/actions/sign-out";

export function LogoutButton() {
    const t = useTranslations();

    return (
        <form action={signOut}>
            <button
                type="submit"
                className="settings-tile flex w-full items-center justify-between rounded-[1.35rem] p-4 text-destructive transition-transform duration-200 hover:-translate-y-0.5"
            >
                <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">{t("profile.logOut")}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
        </form>
    );
}
