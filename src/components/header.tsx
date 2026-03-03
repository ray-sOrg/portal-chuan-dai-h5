'use client';

import { useTranslations } from 'next-intl';
import { ThemeToggle } from '@/components/theme';
import { LanguageToggle } from '@/components/language-toggle';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const t = useTranslations();

  return (
    <header className="fixed top-0 left-0 right-0 h-12 px-4 bg-background/80 backdrop-blur-sm border-b border-border z-50">
      <div className="h-full flex items-center justify-between">
        <h1 className="text-lg font-bold">{title || t('header.title')}</h1>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
