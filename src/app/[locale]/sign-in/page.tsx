import { useTranslations } from "next-intl";

import { SignInForm } from "@/features/auth/components";
import { ThemeToggle } from "@/components/theme";
import { LanguageToggle } from "@/components/language-toggle";
import { getAuth } from "@/features/auth/queries/get-auth";
import { redirect } from "@/i18n/routing";

interface SignInPageProps {
    searchParams: Promise<{ redirect?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
    const { user } = await getAuth();
    const params = await searchParams;
    const redirectTo = params.redirect || '/profile';

    // 已登录用户重定向
    if (user) {
        redirect({ href: redirectTo, locale: "zh" });
    }

    return <SignInPageContent redirectTo={redirectTo} />;
}

function SignInPageContent({ redirectTo }: { redirectTo: string }) {
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
                    <SignInForm redirectTo={redirectTo} />
                </div>
            </main>
        </div>
    );
}
