'use client';

import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { routing } from '@/i18n/routing';
import { useLanguage, type SupportedLocale } from '@/stores/language';

export function LanguageToggle() {
  const t = useTranslations('common');
  const locale = useLocale();
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

    // 直接替换 URL 中的 locale 前缀，避免动态路由的类型约束影响构建
    const url = new URL(window.location.href);
    const segments = url.pathname.split('/');
    const currentLocale = segments[1];

    if (routing.locales.includes(currentLocale as 'en' | 'zh')) {
      segments[1] = supportedLocale;
    } else {
      segments.splice(1, 0, supportedLocale);
    }

    url.pathname = segments.join('/') || `/${supportedLocale}`;
    window.location.assign(url.toString());
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-8 min-w-8 items-center justify-center rounded-full px-2',
          'text-[11px] font-semibold uppercase text-muted-foreground transition-colors',
          'hover:bg-primary/8 hover:text-primary',
          'focus:outline-none focus:ring-2 focus:ring-primary/20'
        )}
        aria-label={t('language')}
      >
        {locale}
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
