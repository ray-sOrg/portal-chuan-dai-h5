'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Camera, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadPhoto } from '@/features/photo/actions';

// 情绪标签类型
type EmotionTag = 'HAPPY' | 'EXCITED' | 'WARM' | 'NOSTALGIC' | 'FUNNY';

// 情绪标签选项
const emotionTags: { value: EmotionTag; label: string; emoji: string }[] = [
    { value: 'HAPPY', label: '开心', emoji: '😊' },
    { value: 'EXCITED', label: '兴奋', emoji: '🎉' },
    { value: 'WARM', label: '温馨', emoji: '🥰' },
    { value: 'NOSTALGIC', label: '怀旧', emoji: '🌅' },
    { value: 'FUNNY', label: '搞笑', emoji: '😂' },
];

// 上传状态
type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

// 图片数据
interface ImageItem {
    id: string;
    file: File;
    preview: string;
    width: number;
    height: number;
    status: UploadStatus;
    progress: number; // 上传进度 0-100
    url?: string; // COS URL
    error?: string;
}

// 读取图片尺寸
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
            URL.revokeObjectURL(img.src);
        };
        img.onerror = () => resolve({ width: 0, height: 0 });
        img.src = URL.createObjectURL(file);
    });
}

// 将 File 转为 base64
function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 生成唯一 ID
function generateId(): string {
    return Math.random().toString(36).substring(2, 10);
}

export function UploadForm() {
    const router = useRouter();
    const locale = useLocale();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isPending, startTransition] = useTransition();

    // 表单状态
    const [images, setImages] = useState<ImageItem[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [emotionTag, setEmotionTag] = useState<EmotionTag | ''>('');
    const [error, setError] = useState('');

    // 组件卸载时清理所有 preview URL，防止内存泄漏
    useEffect(() => {
        return () => {
            images.forEach((img) => {
                if (img.preview) {
                    URL.revokeObjectURL(img.preview);
                }
            });
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // 上传单张图片到 COS（通过 API Route）
    const uploadSingleImage = async (item: ImageItem) => {
        // 模拟进度的定时器
        let progressInterval: NodeJS.Timeout | null = null;

        try {
            // 更新状态为上传中，进度从 0 开始
            setImages((prev) =>
                prev.map((img) => (img.id === item.id ? { ...img, status: 'uploading' as UploadStatus, progress: 0 } : img))
            );

            // 根据文件大小计算基础速度（大文件慢，小文件快）
            const fileSizeMB = item.file.size / (1024 * 1024);
            const baseInterval = Math.min(200, Math.max(80, fileSizeMB * 20)); // 80-200ms

            // 启动模拟进度（带随机性）
            progressInterval = setInterval(() => {
                setImages((prev) =>
                    prev.map((img) => {
                        if (img.id === item.id && img.status === 'uploading' && img.progress < 85) {
                            // 进度越高增长越慢 + 随机波动
                            const remaining = 85 - img.progress;
                            const baseIncrement = Math.max(1, Math.floor(remaining / 8));
                            const randomFactor = 0.5 + Math.random(); // 0.5 ~ 1.5
                            const increment = Math.max(1, Math.floor(baseIncrement * randomFactor));
                            return { ...img, progress: Math.min(85, img.progress + increment) };
                        }
                        return img;
                    })
                );
            }, baseInterval);

            // 转为 base64 并调用 API
            const base64Data = await fileToBase64(item.file);
            const response = await fetch('/api/photos/upload-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ base64Data }),
            });

            const result = await response.json();

            // 清除进度定时器
            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = null;
            }

            if (result.success && result.url) {
                setImages((prev) =>
                    prev.map((img) =>
                        img.id === item.id ? { ...img, status: 'success' as UploadStatus, progress: 100, url: result.url } : img
                    )
                );
            } else {
                setImages((prev) =>
                    prev.map((img) =>
                        img.id === item.id
                            ? { ...img, status: 'error' as UploadStatus, progress: 0, error: result.error || '上传失败' }
                            : img
                    )
                );
            }
        } catch {
            // 清除进度定时器
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            setImages((prev) =>
                prev.map((img) =>
                    img.id === item.id ? { ...img, status: 'error' as UploadStatus, progress: 0, error: '上传失败' } : img
                )
            );
        }
    };

    // 处理文件选择
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // 限制最多 9 张
        const newFiles = files.slice(0, 9 - images.length);
        if (newFiles.length === 0) return;

        setError('');

        // 创建图片项并立即开始上传
        for (const file of newFiles) {
            const dimensions = await getImageDimensions(file);
            const item: ImageItem = {
                id: generateId(),
                file,
                preview: URL.createObjectURL(file),
                width: dimensions.width,
                height: dimensions.height,
                status: 'pending',
                progress: 0,
            };

            setImages((prev) => [...prev, item]);

            // 立即开始上传
            uploadSingleImage(item);
        }

        // 清空 input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // 移除图片
    const handleRemoveFile = (id: string) => {
        setImages((prev) => {
            const item = prev.find((img) => img.id === id);
            if (item?.preview) {
                URL.revokeObjectURL(item.preview);
            }
            return prev.filter((img) => img.id !== id);
        });
    };

    // 重试上传
    const handleRetry = (item: ImageItem) => {
        uploadSingleImage(item);
    };

    // 检查是否所有图片都上传成功
    const allUploaded = images.length > 0 && images.every((img) => img.status === 'success');
    const hasUploading = images.some((img) => img.status === 'uploading');

    // 提交表单
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (images.length === 0) {
            setError('请选择至少一张照片');
            return;
        }

        if (!allUploaded) {
            setError('请等待所有图片上传完成');
            return;
        }

        if (!title.trim()) {
            setError('请输入标题');
            return;
        }

        startTransition(async () => {
            try {
                const firstImage = images[0];

                const result = await uploadPhoto({
                    title: title.trim(),
                    description: description.trim() || undefined,
                    url: firstImage.url!,
                    width: firstImage.width,
                    height: firstImage.height,
                    emotionTag: emotionTag || undefined,
                });

                if (result.success && result.photoId) {
                    // 跳转到照片墙页面
                    router.push(`/${locale}/photo`);
                    router.refresh();
                } else {
                    setError('保存失败，请重试');
                }
            } catch {
                setError('保存失败，请重试');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 图片选择区域 */}
            <div className="space-y-2">
                <label className="block text-sm font-medium">选择照片</label>
                <div className="grid grid-cols-3 gap-2">
                    {images.map((image) => (
                        <div key={image.id} className="relative aspect-square">
                            <img
                                src={image.preview}
                                alt="预览"
                                className="w-full h-full object-cover rounded-lg"
                            />
                            {/* 上传状态遮罩 */}
                            {image.status === 'uploading' && (
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col items-center justify-center gap-2">
                                    {/* 进度条 */}
                                    <div className="w-3/4 h-1.5 bg-white/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full transition-all duration-100"
                                            style={{ width: `${image.progress}%` }}
                                        />
                                    </div>
                                    <span className="text-white text-xs">{image.progress}%</span>
                                </div>
                            )}
                            {image.status === 'error' && (
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                </div>
                            )}
                            {/* 成功标记 */}
                            {image.status === 'success' && (
                                <div className="absolute bottom-1 right-1">
                                    <CheckCircle className="w-5 h-5 text-green-500 drop-shadow-md" />
                                </div>
                            )}
                            {/* 删除按钮 */}
                            <button
                                type="button"
                                onClick={() => handleRemoveFile(image.id)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            {/* 重试按钮 */}
                            {image.status === 'error' && (
                                <button
                                    type="button"
                                    onClick={() => handleRetry(image)}
                                    className="absolute bottom-1 left-1 right-1 bg-primary text-primary-foreground text-xs py-1 rounded"
                                >
                                    重试
                                </button>
                            )}
                        </div>
                    ))}

                    {/* 添加按钮 */}
                    {images.length < 9 && (
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
                <p className="text-xs text-muted-foreground">最多 9 张，选择后自动上传原图</p>
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
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>
            )}

            {/* 提交按钮 */}
            <button
                type="submit"
                disabled={isPending || !allUploaded || hasUploading || images.length === 0}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        保存中...
                    </>
                ) : hasUploading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        上传中...
                    </>
                ) : (
                    '发布照片'
                )}
            </button>
        </form>
    );
}
