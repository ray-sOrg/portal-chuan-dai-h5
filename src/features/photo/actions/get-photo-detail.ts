'use server';

import { prisma } from '@/lib/prisma';
import { getAuth } from '@/features/auth/queries/get-auth';
import type { PhotoDetail } from '../types';

export async function getPhotoDetail(
  photoId: string
): Promise<PhotoDetail | null> {
  // 获取当前用户（可能未登录）
  const { user } = await getAuth();
  const userId = user?.id;

  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
    select: {
      id: true,
      title: true,
      description: true,
      url: true,
      thumbnailUrl: true,
      mediumUrl: true,
      width: true,
      height: true,
      emotionTag: true,
      createdAt: true,
      uploader: {
        select: {
          id: true,
          nickname: true,
          avatar: true,
        },
      },
      gathering: {
        select: {
          id: true,
          title: true,
          date: true,
          location: true,
        },
      },
      favorites: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
      _count: {
        select: {
          favorites: true,
          comments: true,
        },
      },
    },
  });

  if (!photo) {
    return null;
  }

  return {
    id: photo.id,
    title: photo.title,
    description: photo.description,
    url: photo.url,
    thumbnailUrl: photo.thumbnailUrl,
    mediumUrl: photo.mediumUrl,
    width: photo.width,
    height: photo.height,
    emotionTag: photo.emotionTag,
    createdAt: photo.createdAt,
    uploader: photo.uploader,
    gathering: photo.gathering,
    isFavorited: userId ? (photo.favorites as { id: string }[]).length > 0 : false,
    _count: photo._count,
  };
}
