'use client';

import { useTranslations } from 'next-intl';
import { ThemeToggle } from '@/components/theme';
import { LanguageToggle } from '@/components/language-toggle';

interface HeaderProps {
  title?: string;
}

function BrandSeal() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/65 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur">
      <svg
        viewBox="0 0 28 28"
        className="h-5 w-5 text-primary"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M9 6.5C7.9 8.2 7.4 9.9 7.5 11.7C7.65 14.25 9 16.2 11.4 17.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M18.8 6.2C20.45 8.2 21.05 10.35 20.6 12.65C20.2 14.8 18.95 16.55 16.85 18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M10.5 9.4C10.7 11.95 12.05 13.8 14.55 14.95"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M16.1 8.85C16.75 10 17.15 11.2 17.1 12.55"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="13.9" cy="20.7" r="1.35" fill="currentColor" />
      </svg>
    </div>
  );
}

export function Header({ title }: HeaderProps) {
  const t = useTranslations();

  return (
    <header className="topbar-shell">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <BrandSeal />
            <div className="min-w-0">
              <h1 className="truncate text-[15px] font-semibold tracking-[0.08em]">
                {title || t('header.title')}
              </h1>
              <p className="text-[10px] tracking-[0.16em] text-muted-foreground">Family kitchen</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
