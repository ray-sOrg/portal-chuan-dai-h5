'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { PhotoListItem } from '../types';

interface PhotoCardProps {
    photo: PhotoListItem;
    onFavoriteClick?: (photoId: string) => void;
    isLoading?: boolean;
}

export function PhotoCard({ photo, onFavoriteClick, isLoading }: PhotoCardProps) {
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onFavoriteClick?.(photo.id);
    };

    return (
        <Link href={`/photo/${photo.id}`} className="block">
            <div className="card-base overflow-hidden group">
                {/* 图片容器 */}
                <div className="relative aspect-[3/4] bg-muted">
                    {photo.thumbnailUrl || photo.url ? (
                        <img
                            src={photo.thumbnailUrl || photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            📸
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
