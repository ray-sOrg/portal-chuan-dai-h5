'use server';

import { prisma } from '@/lib/prisma';
import { getAuth } from '@/features/auth/queries/get-auth';
import type { PhotoListItem, PaginatedResult, PaginationParams } from '../types';

// 模拟数据（用于开发测试）- 尺寸设为 null，让组件自动获取真实尺寸
const mockPhotos: PhotoListItem[] = [
  {
    id: 'mock-1',
    title: '聚会合影',
    description: '2024年春节聚会，大家都很开心！',
    url: 'https://img.tt829.cn/chuan-dai/20251222164747.jpg',
    thumbnailUrl: null,
    width: null,
    height: null,
    createdAt: new Date('2024-02-10'),
    isFavorited: false,
    uploader: { id: 'user-1', nickname: '小明', avatar: null },
  },
  {
    id: 'mock-2',
    title: '美食分享',
    description: '今天做的红烧肉，味道超棒',
    url: 'https://img.tt829.cn/chuan-dai/20251222164747.jpg',
    thumbnailUrl: null,
    width: null,
    height: null,
    createdAt: new Date('2024-02-08'),
    isFavorited: true,
    uploader: { id: 'user-2', nickname: '小红', avatar: null },
  },
  {
    id: 'mock-3',
    title: '风景照',
    description: '周末去爬山拍的，风景很美',
    url: 'https://img.tt829.cn/chuan-dai/20251222164747.jpg',
    thumbnailUrl: null,
    width: null,
    height: null,
    createdAt: new Date('2024-02-05'),
    isFavorited: false,
    uploader: { id: 'user-1', nickname: '小明', avatar: null },
  },
  {
    id: 'mock-4',
    title: '生日派对',
    description: null,
    url: 'https://img.tt829.cn/chuan-dai/20251222164747.jpg',
    thumbnailUrl: null,
    width: null,
    height: null,
    createdAt: new Date('2024-01-28'),
    isFavorited: false,
    uploader: { id: 'user-3', nickname: '小李', avatar: null },
  },
  {
    id: 'mock-5',
    title: '宠物日常',
    description: '我家猫咪今天特别可爱，必须记录下来',
    url: 'https://img.tt829.cn/chuan-dai/20251222164747.jpg',
    thumbnailUrl: null,
    width: null,
    height: null,
    createdAt: new Date('2024-01-20'),
    isFavorited: true,
    uploader: { id: 'user-2', nickname: '小红', avatar: null },
  },
  {
    id: 'mock-6',
    title: '下午茶时光',
    description: '和朋友们一起喝下午茶',
    url: 'https://img.tt829.cn/chuan-dai/20251222164747.jpg',
    thumbnailUrl: null,
    width: null,
    height: null,
    createdAt: new Date('2024-01-15'),
    isFavorited: false,
    uploader: { id: 'user-1', nickname: '小明', avatar: null },
  },
];

export async function getPhotos(
  params: PaginationParams = {}
): Promise<PaginatedResult<PhotoListItem>> {
  const { page = 1, pageSize = 20 } = params;
  const skip = (page - 1) * pageSize;

  // 获取当前用户（可能未登录）
  const { user } = await getAuth();
  const userId = user?.id;

  // 查询照片总数
  const total = await prisma.photo.count();

  // 如果数据库没有数据，返回模拟数据
  if (total === 0) {
    const mockItems = mockPhotos.slice(skip, skip + pageSize);
    return {
      items: mockItems,
      total: mockPhotos.length,
      page,
      pageSize,
      hasMore: skip + mockItems.length < mockPhotos.length,
    };
  }

  // 查询照片列表（按时间倒序）
  const photos = await prisma.photo.findMany({
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
      favorites: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
  });

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
    isFavorited: userId ? (photo.favorites as { id: string }[]).length > 0 : false,
  }));

  return {
    items,
    total,
    page,
    pageSize,
    hasMore: skip + items.length < total,
  };
}
