import { useTranslations } from "next-intl";

import { SignInForm } from "@/features/auth/components";
import { ThemeToggle } from "@/components/theme";
import { LanguageToggle } from "@/components/language-toggle";
import { getAuth } from "@/features/auth/queries/get-auth";
import { redirect } from "@/i18n/routing";

export default async function SignInPage() {
    const { user } = await getAuth();

    // 已登录用户重定向到首页
    if (user) {
        redirect({ href: "/home", locale: "zh" });
    }

    return <SignInPageContent />;
}

function SignInPageContent() {
    const t = useTranslations();

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
                <div className="container mx-auto flex items-center justify-between gap-4">
                    <h1 className="text-xl font-bold">{t("header.title")}</h1>
                    <div className="flex items-center gap-2">
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 flex flex-col items-center px-4 py-8">
                <div className="w-full max-w-sm card-base p-6">
                    <h2 className="text-2xl font-bold text-center mb-2">{t("auth.signInTitle")}</h2>
                    <p className="text-muted-foreground text-center mb-8">{t("auth.signInSubtitle")}</p>
                    <SignInForm />
                </div>
            </main>
        </div>
    );
}
