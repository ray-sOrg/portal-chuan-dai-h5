'use server';

import { prisma } from '@/lib/prisma';
import { getAuth } from '@/features/auth/queries/get-auth';
import type { Dish } from '../types';
import { serializeDish } from '../serialize-dish';

/**
 * 获取菜品列表
 */
export async function getDishes(): Promise<Dish[]> {
  const dishes = await prisma.dish.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: 'desc' },
    include: { nutrition: true },
  });

  return dishes.map(serializeDish);
}

/**
 * 获取单个菜品详情
 */
export async function getDishById(id: string): Promise<Dish | null> {
  const dish = await prisma.dish.findUnique({
    where: { id },
    include: { nutrition: true },
  });

  if (!dish) return null;

  return serializeDish(dish);
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
    include: { dish: { include: { nutrition: true } } },
  });

  return favorites.map((f) => serializeDish(f.dish));
}
