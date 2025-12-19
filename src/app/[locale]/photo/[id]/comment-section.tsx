'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { getPhotoComments, addPhotoComment } from '@/features/photo/actions';
import type { PhotoCommentItem } from '@/features/photo/types';

interface CommentSectionProps {
    photoId: string;
    isLoggedIn: boolean;
}

export function CommentSection({ photoId, isLoggedIn }: CommentSectionProps) {
    const router = useRouter();
    const [comments, setComments] = useState<PhotoCommentItem[]>([]);
    const [content, setContent] = useState('');
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);

    // 加载评论
    useEffect(() => {
        const loadComments = async () => {
            setIsLoading(true);
            try {
                const data = await getPhotoComments(photoId);
                setComments(data);
            } finally {
                setIsLoading(false);
            }
        };
        loadComments();
    }, [photoId]);

    // 提交评论
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoggedIn) {
            router.push('../../sign-in');
            return;
        }

        if (!content.trim()) return;

        startTransition(async () => {
            const result = await addPhotoComment(photoId, content);
            if (result.success && result.comment) {
                setComments((prev) => [...prev, result.comment!]);
                setContent('');
            }
        });
    };

    const formatTime = (date: Date) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        if (days < 7) return `${days}天前`;
        return d.toLocaleDateString('zh-CN');
    };

    return (
        <div className="p-4 space-y-4">
            <h3 className="font-bold text-lg">评论 ({comments.length})</h3>

            {/* 评论列表 */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                        加载中...
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        暂无评论，来说点什么吧
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                                {comment.author.avatar ? (
                                    <img
                                        src={comment.author.avatar}
                                        alt={comment.author.nickname || '用户'}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm">👤</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">
                                        {comment.author.nickname || '匿名用户'}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatTime(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm mt-1 break-words">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 评论输入框 */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={isLoggedIn ? '写下你的评论...' : '请先登录后评论'}
                    disabled={isPending}
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                    type="submit"
                    disabled={isPending || !content.trim()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
}
