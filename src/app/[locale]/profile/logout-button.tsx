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
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-destructive"
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
