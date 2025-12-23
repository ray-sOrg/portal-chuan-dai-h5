'use server';

import { prisma } from '@/lib/prisma';
import { getAuth } from '@/features/auth/queries/get-auth';
import type { PhotoListItem, PaginatedResult, PaginationParams } from '../types';

export async function getPhotos(
    params: PaginationParams = {}
): Promise<PaginatedResult<PhotoListItem>> {
    const { page = 1, pageSize = 20 } = params;
    const skip = (page - 1) * pageSize;

    // 获取当前用户（可能未登录）
    const { user } = await getAuth();
    const userId = user?.id;

    // 查询照片列表
    const [total, photos] = await Promise.all([
        prisma.photo.count(),
        prisma.photo.findMany({
            skip,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                description: true,
                url: true,
                thumbnailUrl: true,
                width: true,
                height: true,
                createdAt: true,
                uploader: {
                    select: {
                        id: true,
                        nickname: true,
                        avatar: true,
                    },
                },
            },
        }),
    ]);

    // 如果用户已登录，查询收藏状态
    let userFavorites: Set<string> = new Set();
    if (userId && photos.length > 0) {
        const favorites = await prisma.photoFavorite.findMany({
            where: {
                userId,
                photoId: { in: photos.map((p) => p.id) },
            },
            select: { photoId: true },
        });
        userFavorites = new Set(favorites.map((f) => f.photoId));
    }

    // 转换为 PhotoListItem 格式
    const items: PhotoListItem[] = photos.map((photo) => ({
        id: photo.id,
        title: photo.title,
        description: photo.description,
        url: photo.url,
        thumbnailUrl: photo.thumbnailUrl,
        width: photo.width,
        height: photo.height,
        createdAt: photo.createdAt,
        uploader: photo.uploader,
        isFavorited: userFavorites.has(photo.id),
    }));

    return {
        items,
        total,
        page,
        pageSize,
        hasMore: skip + items.length < total,
    };
}
