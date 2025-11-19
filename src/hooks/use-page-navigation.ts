'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/routing';
import { useNavigation, type TabType } from '@/stores/navigation';

// 路径到标签的映射
const pathToTabMap: Record<string, TabType> = {
  '/': 'home',
  '/menu': 'menu',
  '/photo': 'photo',
  '/profile': 'profile',
};

/**
 * 页面导航同步 Hook
 * 自动根据当前路径设置正确的导航标签状态
 */
export function usePageNavigation() {
  const pathname = usePathname();
  const { activeTab, setActiveTab } = useNavigation();

  useEffect(() => {
    const currentTab = pathToTabMap[pathname];
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [pathname, activeTab, setActiveTab]);

  return {
    activeTab,
    setActiveTab,
  };
}
