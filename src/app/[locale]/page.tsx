import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslations } from 'next-intl';
import { Placeholder } from "@/components/placeholder";
import { Spinner } from "@/components/spinner";
import { ThemeToggle } from "@/components/theme";
import { LanguageToggle } from "@/components/language-toggle";
import { FooterNav } from "@/components/footer-nav";

export default function Home() {
  const t = useTranslations();
  
  return (
    <div className="flex flex-1 flex-col min-h-screen bg-background text-foreground">
      <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">{t('header.title')}</h1>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-20">
        <div className="container mx-auto space-y-8">
          <ErrorBoundary fallback={<Placeholder label={t('placeholder.error')} />}>
            <Suspense fallback={<Spinner />}>
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-2">{t('placeholder.comingSoon')}</h2>
                <p className="text-muted-foreground">{t('header.subtitle')}</p>
              </div>
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
      
      <FooterNav activeTab="home" />
    </div>
  );
}
