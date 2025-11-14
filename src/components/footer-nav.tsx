'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Home, Menu, Camera, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabType = 'home' | 'menu' | 'photo' | 'profile';

interface FooterNavProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

interface NavItem {
  id: TabType;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    labelKey: 'common.home',
    icon: Home,
  },
  {
    id: 'menu',
    labelKey: 'common.menu',
    icon: Menu,
  },
  {
    id: 'photo',
    labelKey: 'common.photo',
    icon: Camera,
  },
  {
    id: 'profile',
    labelKey: 'common.profile',
    icon: User,
  },
];

export function FooterNav({ activeTab = 'home', onTabChange }: FooterNavProps) {
  const [currentTab, setCurrentTab] = useState<TabType>(activeTab);
  const t = useTranslations();

  const handleTabClick = (tab: TabType) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors',
                'min-w-[60px] text-xs font-medium',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              )}
            >
              <Icon 
                className={cn(
                  'w-5 h-5 mb-1',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )} 
              />
              <span className="text-[10px] leading-tight">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </footer>
  );
}
