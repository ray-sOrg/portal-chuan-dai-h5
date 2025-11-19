'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TabType = 'home' | 'menu' | 'photo' | 'profile';

interface NavigationState {
  activeTab: TabType;
  previousTab: TabType | null;
}

interface NavigationActions {
  setActiveTab: (tab: TabType) => void;
  resetNavigation: () => void;
}

type NavigationStore = NavigationState & NavigationActions;

export const useNavigation = create<NavigationStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      activeTab: 'home',
      previousTab: null,

      // 设置当前激活的标签
      setActiveTab: (tab: TabType) => {
        const currentTab = get().activeTab;
        set({
          activeTab: tab,
          previousTab: currentTab !== tab ? currentTab : get().previousTab,
        });
      },

      // 重置导航状态
      resetNavigation: () => {
        set({
          activeTab: 'home',
          previousTab: null,
        });
      },
    }),
    {
      name: 'navigation-storage',
      partialize: (state) => ({
        activeTab: state.activeTab,
      }),
    }
  )
);
