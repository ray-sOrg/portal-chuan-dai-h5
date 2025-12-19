'use server';

import { prisma } from '@/lib/prisma';
import type { PhotoCommentItem } from '../types';

export async function getPhotoComments(
  photoId: string
): Promise<PhotoCommentItem[]> {
  const comments = await prisma.photoComment.findMany({
    where: { photoId },
    orderBy: { createdAt: 'asc' },
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

  return comments;
}
