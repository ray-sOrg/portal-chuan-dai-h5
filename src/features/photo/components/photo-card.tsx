'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, ImageOff } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { PhotoListItem } from '../types';

// 允许的图片域名列表（与 next.config.ts 保持同步）
const ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'img.tt829.cn'];

// 检查 URL 是否可以使用 Next.js Image
function isValidImageUrl(url: string): boolean {
    if (!url || url.trim() === '') return false;
    try {
        const parsed = new URL(url);
        return ALLOWED_HOSTS.includes(parsed.hostname);
    } catch {
        return url.startsWith('/');
    }
}

interface PhotoCardProps {
    photo: PhotoListItem;
    onFavoriteClick?: (photoId: string) => void;
    isLoading?: boolean;
}

export function PhotoCard({ photo, onFavoriteClick, isLoading }: PhotoCardProps) {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [realDimensions, setRealDimensions] = useState<{ width: number; height: number } | null>(null);

    const imageUrl = photo.thumbnailUrl || photo.url;
    const canUseNextImage = isValidImageUrl(imageUrl || '');

    // 优先使用真实尺寸，其次使用数据库尺寸，最后使用默认 3:4
    const width = realDimensions?.width || photo.width;
    const height = realDimensions?.height || photo.height;
    const aspectRatio = width && height ? width / height : 3 / 4;
    const paddingBottom = `${(1 / aspectRatio) * 100}%`;

    // 图片加载完成后获取真实尺寸
    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        if (img.naturalWidth && img.naturalHeight) {
            setRealDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        }
        setImageLoaded(true);
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onFavoriteClick?.(photo.id);
    };

    return (
        <Link href={`/photo/${photo.id}`} className="block">
            <div className="card-base overflow-hidden group">
                {/* 图片容器 - 根据宽高比动态设置高度形成瀑布流 */}
                <div
                    className={cn('relative bg-muted transition-all duration-300', !imageLoaded && 'animate-pulse')}
                    style={{ paddingBottom }}
                >
                    {canUseNextImage && !imageError ? (
                        <Image
                            src={imageUrl!}
                            alt={photo.title}
                            fill
                            sizes="(max-width: 640px) 50vw, 33vw"
                            className="object-cover transition-transform group-hover:scale-105"
                            onLoad={handleImageLoad}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        // 兜底占位图
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
                            <ImageOff className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-xs">图片加载失败</span>
                        </div>
                    )}

                    {/* 收藏按钮 */}
                    <button
                        onClick={handleFavoriteClick}
                        disabled={isLoading}
                        className={cn(
                            'absolute bottom-2 right-2 p-2 rounded-full transition-all',
                            'bg-background/80 backdrop-blur-sm hover:bg-background',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                        aria-label={photo.isFavorited ? '取消收藏' : '收藏'}
                    >
                        <Heart
                            className={cn(
                                'w-4 h-4 transition-colors',
                                photo.isFavorited
                                    ? 'fill-destructive text-destructive'
                                    : 'text-muted-foreground hover:text-destructive'
                            )}
                        />
                    </button>
                </div>

                {/* 信息区域 */}
                <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1">{photo.title}</h3>
                    {photo.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {photo.description}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
