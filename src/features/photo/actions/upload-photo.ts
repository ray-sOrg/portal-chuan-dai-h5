'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/features/auth/queries/get-auth';
import type { EmotionTag } from '@prisma/client';

interface SavePhotoInput {
    title: string;
    description?: string;
    url: string; // 已上传到 COS 的 URL
    width?: number;
    height?: number;
    emotionTag?: EmotionTag;
}

interface SavePhotoResult {
    success: boolean;
    photoId?: string;
    error?: 'UNAUTHORIZED' | 'VALIDATION_ERROR' | 'UNKNOWN';
}

/**
 * 保存照片信息到数据库（图片已上传到 COS）
 */
export async function uploadPhoto(input: SavePhotoInput): Promise<SavePhotoResult> {
    try {
        // 检查登录状态
        const { user } = await getAuth();
        if (!user) {
            return { success: false, error: 'UNAUTHORIZED' };
        }

        // 验证必填字段
        if (!input.title.trim() || !input.url) {
            return { success: false, error: 'VALIDATION_ERROR' };
        }

        // 创建照片记录
        const photo = await prisma.photo.create({
            data: {
                title: input.title.trim(),
                description: input.description?.trim() || null,
                url: input.url,
                thumbnailUrl: null,
                width: input.width || null,
                height: input.height || null,
                emotionTag: input.emotionTag || null,
                uploaderId: user.id,
            },
        });

        // 清除照片列表缓存
        revalidatePath('/photo');

        return { success: true, photoId: photo.id };
    } catch (error) {
        console.error('Save photo error:', error);
        return { success: false, error: 'UNKNOWN' };
    }
}
