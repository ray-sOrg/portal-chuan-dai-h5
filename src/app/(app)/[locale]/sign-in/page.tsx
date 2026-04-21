import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";

import { SignInForm } from "@/features/auth/components";
import { getAuth } from "@/features/auth/queries/get-auth";

interface SignInPageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ redirect?: string }>;
}

export default async function SignInPage({ params, searchParams }: SignInPageProps) {
    const { user } = await getAuth();
    const { locale } = await params;
    const search = await searchParams;
    const redirectTo = search.redirect || `/${locale}/profile`;

    // 已登录用户重定向
    if (user) {
        redirect(redirectTo);
    }

    return <SignInPageContent redirectTo={redirectTo} />;
}

function SignInPageContent({ redirectTo }: { redirectTo: string }) {
    const t = useTranslations();

    return (
        <div className="bg-background text-foreground">
            <main className="flex flex-col items-center px-4 py-8">
                <div className="w-full max-w-sm card-base p-6">
                    <h2 className="text-2xl font-bold text-center mb-2">{t("auth.signInTitle")}</h2>
                    <p className="text-muted-foreground text-center mb-8">{t("auth.signInSubtitle")}</p>
                    <SignInForm redirectTo={redirectTo} />
                </div>
            </main>
        </div>
    );
}
