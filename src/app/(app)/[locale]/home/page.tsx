import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, Camera, Flame, Receipt, Sparkles } from "lucide-react";
import Image from "next/image";

import { Link } from "@/i18n/routing";
import { menuPath, ordersPath, photoPath } from "@/paths";
import { PersonalRecommendations } from "@/features/dish/components";

export default async function Home() {
  const t = await getTranslations();
  const locale = await getLocale();

  const copy =
    locale === "zh"
      ? {
          tag: "家常菜单",
          intro: "今天想吃点什么",
          line: "保留川味的热烈，也保留傣味的清爽。点菜、看照片、查订单，都尽量简单一点。",
          menuCta: "去看菜单",
          photoCta: "看看照片",
          shortcuts: "常用入口",
          featuredTitle: "今天推荐",
          kitchenNote: "川味热烈 / 傣味清爽",
          freshPrep: "现点现做",
          familyTable: "家宴小桌",
          spicy: "热辣一点",
          fresh: "清爽一点",
          open: "打开",
        }
      : {
          tag: "Home Table",
          intro: "What do we want to eat today?",
          line: "Keep the heat of Sichuan and the freshness of Dai, but make the experience quiet and easy to use.",
          menuCta: "Open menu",
          photoCta: "Open photos",
          shortcuts: "Quick access",
          featuredTitle: "For today",
          kitchenNote: "Sichuan heat / Dai freshness",
          freshPrep: "Freshly cooked",
          familyTable: "Family table",
          spicy: "Something warm",
          fresh: "Something fresh",
          open: "Open",
        };

  const quickLinks = [
    { href: menuPath, label: t("common.menu"), icon: Sparkles },
    { href: ordersPath, label: t("home.quickLinks.myOrders"), icon: Receipt },
    { href: photoPath, label: t("common.photo"), icon: Camera },
  ] as const;

  const featuredDishes = [
    {
      title: t("dishes.mapoTofu"),
      desc: t("dishes.mapoTofuDesc"),
      tone: copy.spicy,
    },
    {
      title: t("dishes.danDanNoodles"),
      desc: t("dishes.danDanNoodlesDesc"),
      tone: copy.fresh,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 pb-4">
      <section className="card-base relative overflow-hidden p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1.02fr_0.98fr] md:items-stretch">
          <div className="relative z-10 flex min-h-[17rem] flex-col justify-between p-1 sm:p-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <Flame className="h-3.5 w-3.5" />
                <span>{copy.tag}</span>
              </div>

              <div className="space-y-3">
                <h2 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-[2.15rem]">
                  {copy.intro}
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  {copy.line}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-5 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="settings-tile rounded-[1rem] px-3 py-2">
                  <span className="block font-semibold text-foreground">{copy.kitchenNote}</span>
                </div>
                <div className="settings-tile rounded-[1rem] px-3 py-2">
                  <span className="block font-semibold text-foreground">{copy.freshPrep}</span>
                  <span>{copy.familyTable}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={menuPath}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  {copy.menuCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={photoPath}
                  className="surface-chip inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-foreground transition-transform duration-200 hover:-translate-y-0.5 hover:text-primary"
                >
                  {copy.photoCta}
                </Link>
              </div>
            </div>
          </div>

          <div className="hero-food-panel relative min-h-[15rem] overflow-hidden rounded-[calc(var(--radius)+0.25rem)] border border-white/55 shadow-[var(--shadow-soft)]">
            <div className="hero-steam" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <Image
              src="/brand/sichuan-hero.png"
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 360px, calc(100vw - 48px)"
              className="hero-theme-image hero-theme-image-sichuan object-cover object-center"
            />
            <Image
              src="/brand/dai-hero.png"
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 360px, calc(100vw - 48px)"
              className="hero-theme-image hero-theme-image-yunnan object-cover object-center"
            />
            <div className="hero-image-scrim absolute inset-0 bg-[linear-gradient(90deg,rgba(255,248,240,0.52),transparent_44%)]" />
            <div className="surface-chip hero-image-badge absolute bottom-3 left-3 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Chuan-Dai
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
        <section className="card-base p-5">
          <div className="mb-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              {copy.shortcuts}
            </p>
          </div>
          <div className="grid gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="settings-tile group flex items-center justify-between rounded-[1.25rem] p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-medium">{link.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="card-base p-5">
          <div className="mb-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              {copy.featuredTitle}
            </p>
          </div>
          <div className="space-y-3">
            {featuredDishes.map((dish, index) => (
              <Link
                key={dish.title}
                href={menuPath}
                className="group block rounded-[calc(var(--radius)+0.05rem)] border border-border/80 bg-[var(--surface-soft)] p-4 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                      0{index + 1}
                    </div>
                    <h3 className="text-base font-semibold">{dish.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{dish.desc}</p>
                  </div>
                  <span className="rounded-full border border-border/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {dish.tone}
                  </span>
                </div>
                <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  <span>{copy.open}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>

      <PersonalRecommendations />
    </div>
  );
}
