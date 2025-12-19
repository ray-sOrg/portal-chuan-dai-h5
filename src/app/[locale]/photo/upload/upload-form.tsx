'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, X, Loader2 } from 'lucide-react';
import { uploadPhoto } from '@/features/photo/actions';
import type { GatheringOption } from '@/features/photo/types';

// 情绪标签类型（与 Prisma 枚举对应）
type EmotionTag = 'HAPPY' | 'EXCITED' | 'WARM' | 'NOSTALGIC' | 'FUNNY';

interface UploadFormProps {
    gatherings: GatheringOption[];
}

// 情绪标签选项
const emotionTags: { value: EmotionTag; label: string; emoji: string }[] = [
    { value: 'HAPPY', label: '开心', emoji: '😊' },
    { value: 'EXCITED', label: '兴奋', emoji: '🎉' },
    { value: 'WARM', label: '温馨', emoji: '🥰' },
    { value: 'NOSTALGIC', label: '怀旧', emoji: '🌅' },
    { value: 'FUNNY', label: '搞笑', emoji: '😂' },
];

export function UploadForm({ gatherings }: UploadFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isPending, startTransition] = useTransition();

    // 表单状态
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [gatheringId, setGatheringId] = useState('');
    const [emotionTag, setEmotionTag] = useState<EmotionTag | ''>('');
    const [error, setError] = useState('');

    // 处理文件选择
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // 限制最多 9 张
        const newFiles = files.slice(0, 9 - selectedFiles.length);
        setSelectedFiles((prev) => [...prev, ...newFiles]);

        // 生成预览
        newFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews((prev) => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    // 移除已选图片
    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    // 提交上传
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (selectedFiles.length === 0) {
            setError('请选择至少一张照片');
            return;
        }

        if (!title.trim()) {
            setError('请输入标题');
            return;
        }

        startTransition(async () => {
            try {
                // 这里简化处理，实际应该上传到云存储
                // 目前使用 base64 作为 URL（仅用于演示）
                const preview = previews[0];

                const result = await uploadPhoto({
                    title: title.trim(),
                    description: description.trim() || undefined,
                    url: preview, // 实际应该是云存储 URL
                    emotionTag: emotionTag || undefined,
                    gatheringId: gatheringId || undefined,
                });

                if (result.success && result.photoId) {
                    router.push(`/photo/${result.photoId}`);
                } else {
                    setError('上传失败，请重试');
                }
            } catch {
                setError('上传失败，请重试');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 图片选择区域 */}
            <div className="space-y-2">
                <label className="block text-sm font-medium">选择照片</label>
                <div className="grid grid-cols-3 gap-2">
                    {/* 已选图片预览 */}
                    {previews.map((preview, index) => (
                        <div key={index} className="relative aspect-square">
                            <img
                                src={preview}
                                alt={`预览 ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {/* 添加按钮 */}
                    {selectedFiles.length < 9 && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                            <Camera className="w-8 h-8" />
                            <span className="text-xs mt-1">添加</span>
                        </button>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <p className="text-xs text-muted-foreground">最多可选择 9 张照片</p>
            </div>

            {/* 标题 */}
            <div className="space-y-2">
                <label className="block text-sm font-medium">
                    标题 <span className="text-destructive">*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="给照片起个标题"
                    maxLength={50}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {/* 描述 */}
            <div className="space-y-2">
                <label className="block text-sm font-medium">描述</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="添加一些描述..."
                    maxLength={500}
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {/* 所属聚会 */}
            <div className="space-y-2">
                <label className="block text-sm font-medium">所属聚会</label>
                <select
                    value={gatheringId}
                    onChange={(e) => setGatheringId(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <option value="">不关联聚会</option>
                    {gatherings.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.title} ({new Date(g.date).toLocaleDateString('zh-CN')})
                        </option>
                    ))}
                </select>
            </div>

            {/* 情绪标签 */}
            <div className="space-y-2">
                <label className="block text-sm font-medium">情绪标签（可选）</label>
                <div className="flex flex-wrap gap-2">
                    {emotionTags.map((tag) => (
                        <button
                            key={tag.value}
                            type="button"
                            onClick={() => setEmotionTag(emotionTag === tag.value ? '' : tag.value)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${emotionTag === tag.value
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            {tag.emoji} {tag.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 错误提示 */}
            {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
                    {error}
                </div>
            )}

            {/* 提交按钮 */}
            <button
                type="submit"
                disabled={isPending || selectedFiles.length === 0}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        上传中...
                    </>
                ) : (
                    '上传照片'
                )}
            </button>
        </form>
    );
}
