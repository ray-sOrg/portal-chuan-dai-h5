'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Home, Menu, Camera, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigation, type TabType } from '@/stores/navigation';

interface NavItem {
  id: TabType;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
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
      router.push(targetItem.path as any);
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={cn(
                'flex items-center justify-center p-3 rounded-lg transition-colors',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              )}
              aria-label={t(item.labelKey)}
            >
              <Icon
                className={cn(
                  'w-6 h-6',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              />
            </button>
          );
        })}
      </div>
    </footer>
  );
}
