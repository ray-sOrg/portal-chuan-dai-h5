import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslations } from 'next-intl';
import { Placeholder } from "@/components/placeholder";
import { Spinner } from "@/components/spinner";
import { ThemeToggle } from "@/components/theme";
import { LanguageToggle } from "@/components/language-toggle";

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
              {/* Banner Section */}
              <section className="relative bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">{t('home.banner.title')}</h2>
                  <p className="mb-1 opacity-90">{t('home.banner.subtitle')}</p>
                  <p className="text-lg font-semibold mb-4">{t('home.banner.discount')}</p>
                  <button className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors">
                    {t('home.banner.orderNow')}
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              </section>

              {/* Featured Dishes */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">{t('home.featured.title')}</h3>
                  <button className="text-primary font-medium">{t('home.featured.viewAll')}</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: t('dishes.mapoTofu'), price: '$14.99', desc: t('dishes.mapoTofuDesc') },
                    { name: t('dishes.danDanNoodles'), price: '$12.50', desc: t('dishes.danDanNoodlesDesc') }
                  ].map((dish, index) => (
                    <div key={index} className="bg-card rounded-lg overflow-hidden border border-border">
                      <div className="aspect-square bg-muted flex items-center justify-center">
                        📸
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium mb-1">{dish.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{dish.desc}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-primary">{dish.price}</span>
                          <button className="bg-primary text-primary-foreground w-6 h-6 rounded-full text-sm">+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Latest News */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">{t('home.news.title')}</h3>
                  <button className="text-primary font-medium">{t('home.news.viewAll')}</button>
                </div>
                <div className="space-y-4">
                  {[
                    { title: t('home.news.menuUpdate'), desc: t('home.news.menuUpdateDesc'), date: 'October 26, 2023', type: 'Update' },
                    { title: t('home.news.chefInterview'), desc: t('home.news.chefInterviewDesc'), date: 'October 20, 2023', type: 'Interview' }
                  ].map((news, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-card rounded-lg border border-border">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        📰
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{news.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{news.desc}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{news.date}</span>
                          <span className="bg-secondary/10 text-secondary px-2 py-1 text-xs rounded-full">{news.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Links */}
              <section>
                <h3 className="text-xl font-semibold mb-4">{t('home.quickLinks.title')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { labelKey: 'home.quickLinks.myOrders', icon: '📋' },
                    { labelKey: 'home.quickLinks.recipes', icon: '📖' },
                    { labelKey: 'home.quickLinks.discover', icon: '🔍' },
                    { labelKey: 'home.quickLinks.favorites', icon: '❤️' }
                  ].map((link, index) => (
                    <button key={index} className="flex flex-col items-center p-4 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <span className="text-2xl mb-2">{link.icon}</span>
                      <span className="text-sm font-medium">{t(link.labelKey)}</span>
                    </button>
                  ))}
                </div>
              </section>
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
