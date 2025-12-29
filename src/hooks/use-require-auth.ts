'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCallback } from 'react';

interface UseRequireAuthOptions {
    /** 是否已登录 */
    isLoggedIn: boolean;
    /** 自定义登录后返回的路径，默认为当前页面 */
    redirectTo?: string;
}

/**
 * 需要登录才能执行的操作 hook
 * 
 * @example
 * ```tsx
 * const { requireAuth } = useRequireAuth({ isLoggedIn });
 * 
 * const handleLike = () => {
 *   requireAuth(() => {
 *     // 执行收藏操作
 *     toggleFavorite(photoId);
 *   });
 * };
 * ```
 */
export function useRequireAuth({ isLoggedIn, redirectTo }: UseRequireAuthOptions) {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    /**
     * 包装需要登录的操作
     * 如果未登录，跳转到登录页；已登录则执行回调
     */
    const requireAuth = useCallback(
        (callback: () => void) => {
            if (isLoggedIn) {
                callback();
            } else {
                const returnPath = redirectTo || pathname;
                router.push(`/${locale}/sign-in?redirect=${encodeURIComponent(returnPath)}`);
            }
        },
        [isLoggedIn, redirectTo, pathname, locale, router]
    );

    /**
     * 跳转到需要登录的页面
     * 如果未登录，先跳转登录页；已登录则直接跳转目标页
     */
    const navigateWithAuth = useCallback(
        (targetPath: string) => {
            if (isLoggedIn) {
                router.push(targetPath);
            } else {
                router.push(`/${locale}/sign-in?redirect=${encodeURIComponent(targetPath)}`);
            }
        },
        [isLoggedIn, locale, router]
    );

    /**
     * 生成带登录检查的跳转链接
     */
    const getAuthUrl = useCallback(
        (targetPath: string) => {
            if (isLoggedIn) {
                return targetPath;
            }
            return `/${locale}/sign-in?redirect=${encodeURIComponent(targetPath)}`;
        },
        [isLoggedIn, locale]
    );

    return {
        requireAuth,
        navigateWithAuth,
        getAuthUrl,
        isLoggedIn,
    };
}
