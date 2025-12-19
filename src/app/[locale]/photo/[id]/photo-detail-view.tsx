'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { togglePhotoFavorite } from '@/features/photo/actions/toggle-favorite';
import type { PhotoDetail } from '@/features/photo/types';

interface PhotoDetailViewProps {
    photo: PhotoDetail;
    isLoggedIn: boolean;
}

// 情绪标签映射
const emotionTagLabels: Record<string, { zh: string; en: string; emoji: string }> = {
    HAPPY: { zh: '开心', en: 'Happy', emoji: '😊' },
    EXCITED: { zh: '兴奋', en: 'Excited', emoji: '🎉' },
    WARM: { zh: '温馨', en: 'Warm', emoji: '🥰' },
    NOSTALGIC: { zh: '怀旧', en: 'Nostalgic', emoji: '🌅' },
    FUNNY: { zh: '搞笑', en: 'Funny', emoji: '😂' },
};

export function PhotoDetailView({ photo, isLoggedIn }: PhotoDetailViewProps) {
    const router = useRouter();
    const [isFavorited, setIsFavorited] = useState(photo.isFavorited);
    const [isPending, startTransition] = useTransition();

    const handleFavoriteClick = () => {
        if (!isLoggedIn) {
            router.push('../sign-in');
            return;
        }

        startTransition(async () => {
            const result = await togglePhotoFavorite(photo.id);
            if (result.success) {
                setIsFavorited(result.isFavorited);
            }
        });
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-4">
            {/* 大图展示 */}
            <div className="relative bg-black">
                <img
                    src={photo.mediumUrl || photo.url}
                    alt={photo.title}
                    className="w-full max-h-[60vh] object-contain"
                />
            </div>

            {/* 信息区域 */}
            <div className="p-4 space-y-4">
                {/* 标题和收藏 */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold">{photo.title}</h2>
                        {photo.description && (
                            <p className="text-muted-foreground mt-2">{photo.description}</p>
                        )}
                    </div>
                    <button
                        onClick={handleFavoriteClick}
                        disabled={isPending}
                        className={cn(
                            'p-3 rounded-full transition-all',
                            'bg-muted hover:bg-muted/80',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                    >
                        <Heart
                            className={cn(
                                'w-6 h-6 transition-colors',
                                isFavorited
                                    ? 'fill-destructive text-destructive'
                                    : 'text-muted-foreground'
                            )}
                        />
                    </button>
                </div>

                {/* 元信息 */}
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {/* 上传时间 */}
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(photo.createdAt)}</span>
                    </div>

                    {/* 情绪标签 */}
                    {photo.emotionTag && emotionTagLabels[photo.emotionTag] && (
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                            {emotionTagLabels[photo.emotionTag].emoji}{' '}
                            {emotionTagLabels[photo.emotionTag].zh}
                        </span>
                    )}

                    {/* 收藏数 */}
                    <span>{photo._count.favorites} 收藏</span>
                    <span>{photo._count.comments} 评论</span>
                </div>

                {/* 聚会信息 */}
                {photo.gathering && (
                    <div className="card-base p-4">
                        <h3 className="font-medium mb-2">所属聚会</h3>
                        <div className="space-y-1 text-sm">
                            <p className="font-medium">{photo.gathering.title}</p>
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(photo.gathering.date)}</span>
                            </div>
                            {photo.gathering.location && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span>{photo.gathering.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 上传者信息 */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {photo.uploader.avatar ? (
                            <img
                                src={photo.uploader.avatar}
                                alt={photo.uploader.nickname || '用户'}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-lg">👤</span>
                        )}
                    </div>
                    <div>
                        <p className="font-medium">{photo.uploader.nickname || '匿名用户'}</p>
                        <p className="text-xs text-muted-foreground">上传者</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
