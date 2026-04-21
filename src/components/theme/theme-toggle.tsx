"use client";

import { useLocale } from "next-intl";
import { Flame, Leaf } from "lucide-react";
import { useTheme } from "next-themes";

// 主题配置
const themeConfig = {
  sichuan: {
    icon: Flame,
    label: {
      zh: "川味",
      en: "Sichuan",
    },
    next: "yunnan",
  },
  yunnan: {
    icon: Leaf,
    label: {
      zh: "傣味",
      en: "Dai",
    },
    next: "sichuan",
  },
} as const;

type ThemeName = keyof typeof themeConfig;

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const locale = useLocale();
  const currentTheme = ((theme ?? resolvedTheme) as ThemeName) || "sichuan";
  const config = themeConfig[currentTheme] || themeConfig.sichuan;
  const Icon = config.icon;
  const localeKey = locale === "zh" ? "zh" : "en";
  const nextLabel = themeConfig[config.next].label[localeKey];

  return (
    <button
      onClick={() => setTheme(config.next)}
      className="surface-chip flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-transform duration-200 hover:-translate-y-0.5 hover:text-primary"
      aria-label={locale === "zh" ? `切换到${nextLabel}` : `Switch to ${nextLabel}`}
      title={config.label[localeKey]}
    >
      <Icon className="h-4 w-4 text-primary" />
    </button>
  );
}
