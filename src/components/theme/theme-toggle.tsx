"use client";

import * as React from "react";
import { Flame, Leaf } from "lucide-react";
import { useTheme } from "next-themes";

// 主题配置
const themeConfig = {
  sichuan: {
    icon: Flame,
    label: "川味主题",
    next: "yunnan",
  },
  yunnan: {
    icon: Leaf,
    label: "傣味主题",
    next: "sichuan",
  },
} as const;

type ThemeName = keyof typeof themeConfig;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 避免服务端渲染和客户端渲染不一致
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = (theme as ThemeName) || "sichuan";
  const config = themeConfig[currentTheme] || themeConfig.sichuan;
  const Icon = config.icon;

  return (
    <button
      onClick={() => setTheme(config.next)}
      className="rounded-lg p-2 hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label={`切换到${themeConfig[config.next].label}`}
      title={config.label}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
