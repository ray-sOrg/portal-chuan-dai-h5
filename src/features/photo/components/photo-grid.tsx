'use client';

import { useCallback, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PhotoCard } from './photo-card';
import { togglePhotoFavorite } from '@/features/photo/actions/toggle-favorite';
import type { PhotoListItem } from '../types';

interface PhotoGridProps {
    initialPhotos: PhotoListItem[];
    hasMore?: boolean;
    onLoadMore?: () => Promise<PhotoListItem[]>;
}

export function PhotoGrid({ initialPhotos, hasMore = false, onLoadMore }: PhotoGridProps) {
    const [photos, setPhotos] = useState(initialPhotos);
    const [loading, setLoading] = useState(false);
    const [canLoadMore, setCanLoadMore] = useState(hasMore);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // 处理收藏点击
    const handleFavoriteClick = useCallback(
        async (photoId: string) => {
            startTransition(async () => {
                const result = await togglePhotoFavorite(photoId);

                if (result.success) {
                    // 更新本地状态
                    setPhotos((prev) =>
                        prev.map((p) =>
                            p.id === photoId ? { ...p, isFavorited: result.isFavorited } : p
                        )
                    );
                } else if (result.error === 'UNAUTHORIZED') {
                    // 未登录，跳转登录页
                    router.push('/sign-in');
                }
            });
        },
        [router]
    );

    // 加载更多
    const handleLoadMore = useCallback(async () => {
        if (!onLoadMore || loading) return;

        setLoading(true);
        try {
            const newPhotos = await onLoadMore();
            setPhotos((prev) => [...prev, ...newPhotos]);
            if (newPhotos.length === 0) {
                setCanLoadMore(false);
            }
        } finally {
            setLoading(false);
        }
    }, [onLoadMore, loading]);

    // 将照片分成两列（瀑布流效果）
    const leftColumn: PhotoListItem[] = [];
    const rightColumn: PhotoListItem[] = [];

    photos.forEach((photo, index) => {
        if (index % 2 === 0) {
            leftColumn.push(photo);
        } else {
            rightColumn.push(photo);
        }
    });

    return (
        <div className="space-y-4">
            {/* 瀑布流网格 */}
            <div className="grid grid-cols-2 gap-3">
                {/* 左列 */}
                <div className="space-y-3">
                    {leftColumn.map((photo) => (
                        <PhotoCard
                            key={photo.id}
                            photo={photo}
                            onFavoriteClick={handleFavoriteClick}
                            isLoading={isPending}
                        />
                    ))}
                </div>

                {/* 右列 */}
                <div className="space-y-3">
                    {rightColumn.map((photo) => (
                        <PhotoCard
                            key={photo.id}
                            photo={photo}
                            onFavoriteClick={handleFavoriteClick}
                            isLoading={isPending}
                        />
                    ))}
                </div>
            </div>

            {/* 加载更多按钮 */}
            {canLoadMore && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                    >
                        {loading ? '加载中...' : '加载更多'}
                    </button>
                </div>
            )}

            {/* 空状态 */}
            {photos.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>暂无照片</p>
                </div>
            )}
        </div>
    );
}
