'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/features/auth/queries/get-auth';
import type { Dish } from '../types';

/**
 * 获取菜品列表
 */
export async function getDishes(): Promise<Dish[]> {
  const dishes = await prisma.dish.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: 'desc' },
  });

  // 转换 Decimal 到 number
  return dishes.map((dish) => ({
    id: dish.id,
    name: dish.name,
    nameEn: dish.nameEn,
    description: dish.description,
    descEn: dish.descEn,
    price: typeof dish.price === 'number' ? dish.price : dish.price.toNumber(),
    image: dish.image,
    category: dish.category,
    isSpicy: dish.isSpicy,
    isVegetarian: dish.isVegetarian,
    isAvailable: dish.isAvailable,
    createdAt: dish.createdAt,
    updatedAt: dish.updatedAt,
  }));
}

/**
 * 获取单个菜品详情
 */
export async function getDishById(id: string): Promise<Dish | null> {
  const dish = await prisma.dish.findUnique({
    where: { id },
  });

  if (!dish) return null;

  return {
    id: dish.id,
    name: dish.name,
    nameEn: dish.nameEn,
    description: dish.description,
    descEn: dish.descEn,
    price: typeof dish.price === 'number' ? dish.price : dish.price.toNumber(),
    image: dish.image,
    category: dish.category,
    isSpicy: dish.isSpicy,
    isVegetarian: dish.isVegetarian,
    isAvailable: dish.isAvailable,
    createdAt: dish.createdAt,
    updatedAt: dish.updatedAt,
  };
}

/**
 * 切换菜品收藏状态
 */
export async function toggleDishFavorite(dishId: string) {
  const { user } = await getAuth();

  if (!user) {
    return { success: false, message: '请先登录' };
  }

  // 检查是否已收藏
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_dishId: {
        userId: user.id,
        dishId,
      },
    },
  });

  if (existing) {
    // 取消收藏
    await prisma.favorite.delete({
      where: { id: existing.id },
    });
    return { success: true, isFavorite: false };
  } else {
    // 添加收藏
    await prisma.favorite.create({
      data: {
        userId: user.id,
        dishId,
      },
    });
    return { success: true, isFavorite: true };
  }
}

/**
 * 加入菜单（添加到购物车/点菜单）
 * TODO: 后续实现完整购物车功能
 */
export async function addToMenu(dishId: string, quantity: number = 1) {
  const { user } = await getAuth();

  if (!user) {
    return { success: false, message: '请先登录' };
  }

  // TODO: 实现购物车逻辑
  // 目前只返回成功消息
  console.log(`[addToMenu] userId=${user.id}, dishId=${dishId}, quantity=${quantity}`);

  return {
    success: true,
    message: '已添加到菜单',
    dishId,
    quantity,
  };
}

/**
 * 获取用户收藏的菜品
 */
export async function getFavoriteDishes(): Promise<Dish[]> {
  const { user } = await getAuth();

  if (!user) return [];

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: { dish: true },
  });

  return favorites.map((f) => ({
    id: f.dish.id,
    name: f.dish.name,
    nameEn: f.dish.nameEn,
    description: f.dish.description,
    descEn: f.dish.descEn,
    price: typeof f.dish.price === 'number' ? f.dish.price : f.dish.price.toNumber(),
    image: f.dish.image,
    category: f.dish.category,
    isSpicy: f.dish.isSpicy,
    isVegetarian: f.dish.isVegetarian,
    isAvailable: f.dish.isAvailable,
    createdAt: f.dish.createdAt,
    updatedAt: f.dish.updatedAt,
  }));
}
