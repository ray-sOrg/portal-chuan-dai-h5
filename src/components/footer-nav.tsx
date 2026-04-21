'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Home, Menu, Camera, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigation, type TabType } from '@/stores/navigation';

type NavPath = '/home' | '/menu' | '/photo' | '/profile';

interface NavItem {
  id: TabType;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  path: NavPath;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    labelKey: 'common.home',
    icon: Home,
    path: '/home',
  },
  {
    id: 'menu',
    labelKey: 'common.menu',
    icon: Menu,
    path: '/menu',
  },
  {
    id: 'photo',
    labelKey: 'common.photo',
    icon: Camera,
    path: '/photo',
  },
  {
    id: 'profile',
    labelKey: 'common.profile',
    icon: User,
    path: '/profile',
  },
];

export function FooterNav() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const { activeTab, setActiveTab } = useNavigation();

  // 根据当前路径同步激活状态
  useEffect(() => {
    const currentItem = navItems.find(item => item.path === pathname);
    if (currentItem && currentItem.id !== activeTab) {
      setActiveTab(currentItem.id);
    }
  }, [pathname, activeTab, setActiveTab]);

  const handleTabClick = (tab: TabType) => {
    const targetItem = navItems.find(item => item.id === tab);
    if (targetItem) {
      setActiveTab(tab);
      router.push(targetItem.path);
    }
  };

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
      <div className="mx-auto max-w-md">
        <div className="floating-dock flex items-center justify-between px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={cn(
                'flex min-w-[4.2rem] flex-col items-center justify-center rounded-xl px-3 py-2 transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-[0_10px_25px_rgba(0,0,0,0.12)]'
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
              )}
              aria-label={t(item.labelKey)}
            >
              <Icon
                className={cn(
                  'h-5 w-5',
                  isActive ? 'text-primary-foreground' : 'text-current'
                )}
              />
              <span
                className={cn(
                  'mt-1 text-[11px] font-medium',
                  isActive ? 'text-primary-foreground' : 'text-current'
                )}
              >
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}
        </div>
      </div>
    </footer>
  );
}
