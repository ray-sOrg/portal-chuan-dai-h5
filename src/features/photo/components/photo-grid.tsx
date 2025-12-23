'use client';

import { useCallback, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Masonry from 'react-masonry-css';
import { PhotoCard } from './photo-card';
import { togglePhotoFavorite } from '@/features/photo/actions/toggle-favorite';
import type { PhotoListItem } from '../types';

interface PhotoGridProps {
    initialPhotos: PhotoListItem[];
    hasMore?: boolean;
    onLoadMore?: () => Promise<PhotoListItem[]>;
}

// 响应式断点配置
const breakpointColumns = {
    default: 2,  // 默认 2 列
    640: 2,      // sm 及以上 2 列
    480: 2,      // 小屏幕 2 列
};

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
                    setPhotos((prev) =>
                        prev.map((p) =>
                            p.id === photoId ? { ...p, isFavorited: result.isFavorited } : p
                        )
                    );
                } else if (result.error === 'UNAUTHORIZED') {
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

    return (
        <div className="space-y-4">
            {/* 瀑布流网格 */}
            <Masonry
                breakpointCols={breakpointColumns}
                className="masonry-grid"
                columnClassName="masonry-grid-column"
            >
                {photos.map((photo) => (
                    <PhotoCard
                        key={photo.id}
                        photo={photo}
                        onFavoriteClick={handleFavoriteClick}
                        isLoading={isPending}
                    />
                ))}
            </Masonry>

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
