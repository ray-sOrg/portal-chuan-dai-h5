'use server';

import { prisma } from '@/lib/prisma';
import { getAuth } from '@/features/auth/queries/get-auth';

interface ToggleFavoriteResult {
  success: boolean;
  isFavorited: boolean;
  error?: 'UNAUTHORIZED' | 'NOT_FOUND' | 'UNKNOWN';
}

export async function togglePhotoFavorite(
  photoId: string
): Promise<ToggleFavoriteResult> {
  try {
    // 检查登录状态
    const { user } = await getAuth();
    if (!user) {
      return { success: false, isFavorited: false, error: 'UNAUTHORIZED' };
    }

    // 检查照片是否存在
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      select: { id: true },
    });

    if (!photo) {
      return { success: false, isFavorited: false, error: 'NOT_FOUND' };
    }

    // 检查是否已收藏
    const existingFavorite = await prisma.photoFavorite.findUnique({
      where: {
        userId_photoId: {
          userId: user.id,
          photoId,
        },
      },
    });

    if (existingFavorite) {
      // 已收藏，取消收藏
      await prisma.photoFavorite.delete({
        where: { id: existingFavorite.id },
      });
      return { success: true, isFavorited: false };
    } else {
      // 未收藏，添加收藏
      await prisma.photoFavorite.create({
        data: {
          userId: user.id,
          photoId,
        },
      });
      return { success: true, isFavorited: true };
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    return { success: false, isFavorited: false, error: 'UNKNOWN' };
  }
}
