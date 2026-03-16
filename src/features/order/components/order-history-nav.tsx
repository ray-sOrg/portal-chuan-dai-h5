'use client';

import { ChevronRight, ClipboardList, History } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function OrderHistoryNav() {
  const t = useTranslations();

  return (
    <section className="card-base overflow-hidden">
      <h3 className="text-lg font-semibold p-4 flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-primary" />
        我的订单
      </h3>
      <div>
        <button
          onClick={() => window.location.href = '/zh/orders'}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border"
        >
          <div className="flex items-center gap-3">
            <History className="w-5 h-5" />
            <span className="font-medium">{t("profile.orderHistory")}</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </section>
  );
}
