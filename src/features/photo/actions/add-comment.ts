'use server';

import { prisma } from '@/lib/prisma';
import { getAuth } from '@/features/auth/queries/get-auth';
import type { PhotoCommentItem } from '../types';

interface AddCommentResult {
  success: boolean;
  comment?: PhotoCommentItem;
  error?: 'UNAUTHORIZED' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'UNKNOWN';
}

export async function addPhotoComment(
  photoId: string,
  content: string
): Promise<AddCommentResult> {
  try {
    // 检查登录状态
    const { user } = await getAuth();
    if (!user) {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    // 验证内容
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return { success: false, error: 'VALIDATION_ERROR' };
    }

    // 检查照片是否存在
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      select: { id: true },
    });

    if (!photo) {
      return { success: false, error: 'NOT_FOUND' };
    }

    // 创建评论
    const comment = await prisma.photoComment.create({
      data: {
        content: trimmedContent,
        photoId,
        authorId: user.id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    });

    return { success: true, comment };
  } catch (error) {
    console.error('Add comment error:', error);
    return { success: false, error: 'UNKNOWN' };
  }
}
