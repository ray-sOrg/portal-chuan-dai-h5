'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SupportedLocale = 'en' | 'zh';

interface LanguageState {
  preferredLocale: SupportedLocale;
  lastUsedLocale: SupportedLocale;
  isFirstVisit: boolean;
}

interface LanguageActions {
  setPreferredLocale: (locale: SupportedLocale) => void;
  updateLastUsedLocale: (locale: SupportedLocale) => void;
  markAsVisited: () => void;
  getPreferredLocale: () => SupportedLocale;
}

type LanguageStore = LanguageState & LanguageActions;

// 检测浏览器语言偏好
const detectBrowserLanguage = (): SupportedLocale => {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.toLowerCase();
  
  // 检测中文相关的语言代码
  if (browserLang.startsWith('zh') || 
      browserLang.includes('cn') || 
      browserLang.includes('chinese')) {
    return 'zh';
  }
  
  return 'en';
};

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      preferredLocale: 'en', // 默认英文，会在客户端初始化时更新
      lastUsedLocale: 'en',
      isFirstVisit: true,

      // 设置用户偏好语言
      setPreferredLocale: (locale: SupportedLocale) => {
        set({
          preferredLocale: locale,
          lastUsedLocale: locale,
          isFirstVisit: false,
        });
      },

      // 更新最后使用的语言
      updateLastUsedLocale: (locale: SupportedLocale) => {
        set({
          lastUsedLocale: locale,
        });
      },

      // 标记为已访问
      markAsVisited: () => {
        set({
          isFirstVisit: false,
        });
      },

      // 获取推荐的语言
      getPreferredLocale: () => {
        const state = get();
        
        // 如果是首次访问，使用浏览器语言检测
        if (state.isFirstVisit) {
          const browserLang = detectBrowserLanguage();
          // 自动设置为检测到的语言
          set({
            preferredLocale: browserLang,
            lastUsedLocale: browserLang,
            isFirstVisit: false,
          });
          return browserLang;
        }
        
        // 否则使用用户偏好或最后使用的语言
        return state.preferredLocale || state.lastUsedLocale;
      },
    }),
    {
      name: 'language-preference',
      partialize: (state) => ({
        preferredLocale: state.preferredLocale,
        lastUsedLocale: state.lastUsedLocale,
        isFirstVisit: state.isFirstVisit,
      }),
    }
  )
);
