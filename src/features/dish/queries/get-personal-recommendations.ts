import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { getAuth } from "@/features/auth/queries/get-auth";

export const getPersonalRecommendations = cache(async () => {
  const { user } = await getAuth();

  if (!user) {
    return { isLoggedIn: false, favorites: [], recommendations: [] };
  }

  // 获取用户收藏的菜品
  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      dish: true,
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  // 如果有收藏，根据收藏的分类推荐同类菜品
  let recommendations: typeof favorites[0]["dish"][] = [];

  if (favorites.length > 0) {
    const favoriteCategories = [...new Set(favorites.map((f) => f.dish.category))];
    const favoriteDishIds = favorites.map((f) => f.dishId);

    recommendations = await prisma.dish.findMany({
      where: {
        category: { in: favoriteCategories },
        id: { notIn: favoriteDishIds },
        isAvailable: true,
      },
      take: 4,
    });
  }

  return {
    isLoggedIn: true,
    favorites: favorites.map((f) => f.dish),
    recommendations,
  };
});
