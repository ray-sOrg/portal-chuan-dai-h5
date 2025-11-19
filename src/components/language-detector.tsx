'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useLanguage, type SupportedLocale } from '@/stores/language';

/**
 * 语言检测和同步组件
 * 负责：
 * 1. 首次访问时检测浏览器语言
 * 2. 同步当前路由语言到存储
 * 3. 处理语言偏好逻辑
 */
export function LanguageDetector() {
  const locale = useLocale() as SupportedLocale;
  const { 
    updateLastUsedLocale, 
    getPreferredLocale, 
    isFirstVisit,
    markAsVisited 
  } = useLanguage();

  useEffect(() => {
    // 更新最后使用的语言
    updateLastUsedLocale(locale);

    // 如果是首次访问，触发语言检测
    if (isFirstVisit) {
      getPreferredLocale(); // 这会触发浏览器语言检测并保存
      markAsVisited();
    }
  }, [locale, updateLastUsedLocale, getPreferredLocale, isFirstVisit, markAsVisited]);

  // 这个组件不渲染任何内容
  return null;
}
