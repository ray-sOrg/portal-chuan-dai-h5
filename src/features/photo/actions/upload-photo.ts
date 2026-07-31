'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/features/auth/queries/get-auth';
import {
    savePhotosInputSchema,
    type SavePhotosInput,
} from '@/features/photo/photo-rules';

interface SavePhotoResult {
    success: boolean;
    photoCount?: number;
    error?: 'UNAUTHORIZED' | 'VALIDATION_ERROR' | 'UNKNOWN';
}

class PendingPhotoUploadError extends Error {}

/**
 * 批量保存照片信息到数据库（图片已上传到 COS）
 */
export async function uploadPhotos(input: SavePhotosInput): Promise<SavePhotoResult> {
    try {
        // 检查登录状态
        const { user } = await getAuth();
        if (!user) {
            return { success: false, error: 'UNAUTHORIZED' };
        }

        const parsedInput = savePhotosInputSchema.safeParse(input);
        if (!parsedInput.success) {
            return { success: false, error: 'VALIDATION_ERROR' };
        }

        const { title, description, emotionTag, images } = parsedInput.data;
        const result = await prisma.$transaction(async (transaction) => {
            const urls = images.map((image) => image.url);
            const pendingUploads = await transaction.pendingPhotoUpload.findMany({
                where: {
                    uploaderId: user.id,
                    url: { in: urls },
                },
                select: { id: true },
            });
            if (pendingUploads.length !== images.length) {
                throw new PendingPhotoUploadError();
            }

            const created = await transaction.photo.createMany({
                data: images.map((image) => ({
                    title,
                    description: description ?? null,
                    url: image.url,
                    thumbnailUrl: null,
                    width: image.width ?? null,
                    height: image.height ?? null,
                    emotionTag: emotionTag ?? null,
                    uploaderId: user.id,
                })),
            });
            const consumed = await transaction.pendingPhotoUpload.deleteMany({
                where: { id: { in: pendingUploads.map((upload) => upload.id) } },
            });
            if (consumed.count !== images.length) {
                throw new PendingPhotoUploadError();
            }

            return created;
        });

        // 清除照片列表缓存
        revalidatePath('/[locale]/photo', 'page');

        return { success: true, photoCount: result.count };
    } catch (error) {
        if (error instanceof PendingPhotoUploadError) {
            return { success: false, error: 'VALIDATION_ERROR' };
        }
        console.error('Save photo error:', error);
        return { success: false, error: 'UNKNOWN' };
    }
}
