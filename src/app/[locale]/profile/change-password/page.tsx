import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme";
import { LanguageToggle } from "@/components/language-toggle";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { ChangePasswordForm } from "@/features/auth/components";

export default async function ChangePasswordPage() {
    await getAuthOrRedirect();

    return <ChangePasswordContent />;
}

function ChangePasswordContent() {
    const t = useTranslations();

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
                <div className="container mx-auto flex items-center justify-between gap-4">
                    <h1 className="text-xl font-bold">{t("auth.changePassword")}</h1>
                    <div className="flex items-center gap-2">
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 flex flex-col items-center px-4 py-8">
                <div className="w-full max-w-sm card-base p-6">
                    <ChangePasswordForm />
                </div>
            </main>
        </div>
    );
}
