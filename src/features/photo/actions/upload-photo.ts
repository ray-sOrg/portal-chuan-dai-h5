'use server';

import { prisma } from '@/lib/prisma';
import { getAuth } from '@/features/auth/queries/get-auth';
import type { EmotionTag } from '@prisma/client';

interface UploadPhotoInput {
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  width?: number;
  height?: number;
  emotionTag?: EmotionTag;
  gatheringId?: string;
}

interface UploadPhotoResult {
  success: boolean;
  photoId?: string;
  error?: 'UNAUTHORIZED' | 'VALIDATION_ERROR' | 'UNKNOWN';
}

export async function uploadPhoto(
  input: UploadPhotoInput
): Promise<UploadPhotoResult> {
  try {
    // 检查登录状态
    const { user } = await getAuth();
    if (!user) {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    // 验证必填字段
    if (!input.title.trim() || !input.url.trim()) {
      return { success: false, error: 'VALIDATION_ERROR' };
    }

    // 创建照片记录
    const photo = await prisma.photo.create({
      data: {
        title: input.title.trim(),
        description: input.description?.trim() || null,
        url: input.url,
        thumbnailUrl: input.thumbnailUrl || null,
        mediumUrl: input.mediumUrl || null,
        width: input.width || null,
        height: input.height || null,
        emotionTag: input.emotionTag || null,
        gatheringId: input.gatheringId || null,
        uploaderId: user.id,
      },
    });

    return { success: true, photoId: photo.id };
  } catch (error) {
    console.error('Upload photo error:', error);
    return { success: false, error: 'UNKNOWN' };
  }
}
