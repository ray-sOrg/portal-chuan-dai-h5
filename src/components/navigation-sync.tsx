'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/routing';
import { useNavigation, type TabType } from '@/stores/navigation';

// 路径到标签的映射
const pathToTabMap: Record<string, TabType> = {
  '/': 'home',
  '/home': 'home',
  '/menu': 'menu',
  '/photo': 'photo',
  '/profile': 'profile',
};

/**
 * 导航同步组件
 * 在客户端自动同步路由和导航状态
 */
export function NavigationSync() {
  const pathname = usePathname();
  const { activeTab, setActiveTab } = useNavigation();

  useEffect(() => {
    const currentTab = pathToTabMap[pathname];
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [pathname, activeTab, setActiveTab]);

  // 这个组件不渲染任何内容，只负责状态同步
  return null;
}
