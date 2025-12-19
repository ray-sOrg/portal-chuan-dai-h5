import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ThemeToggle } from "@/components/theme";
import { LanguageToggle } from "@/components/language-toggle";
import { signInPath } from "@/paths";

export default function ForgotPasswordPage() {
    return <ForgotPasswordContent />;
}

function ForgotPasswordContent() {
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
                <div className="w-full max-w-sm card-base p-6 text-center">
                    <h2 className="text-2xl font-bold mb-4">{t("auth.forgotPassword")}</h2>
                    <p className="text-muted-foreground mb-6">{t("auth.contactAdmin")}</p>
                    <Link
                        href={signInPath}
                        className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        {t("auth.signIn")}
                    </Link>
                </div>
            </main>
        </div>
    );
}
