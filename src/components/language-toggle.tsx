'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useLanguage, type SupportedLocale } from '@/stores/language';

export function LanguageToggle() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { setPreferredLocale, updateLastUsedLocale } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const handleLanguageChange = (newLocale: string) => {
    const supportedLocale = newLocale as SupportedLocale;

    // 更新语言偏好存储
    setPreferredLocale(supportedLocale);
    updateLastUsedLocale(supportedLocale);

    // 路由跳转
    router.replace(pathname, { locale: supportedLocale });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'surface-chip flex h-8 items-center gap-1.5 rounded-full px-2.5 transition-colors',
          'text-xs font-semibold',
          'hover:text-primary',
          'focus:outline-none focus:ring-2 focus:ring-primary/20'
        )}
        aria-label={t('language')}
      >
        <Languages className="h-3.5 w-3.5" />
        <span className="uppercase">{locale}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="card-base absolute right-0 top-full mt-2 z-[101] min-w-[148px] overflow-hidden">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                  'hover:bg-primary/5 hover:text-primary',
                  locale === language.code
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground'
                )}
              >
                <span className="text-base">{language.flag}</span>
                <span>{language.name}</span>
                {locale === language.code && (
                  <span className="ml-auto text-xs text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
