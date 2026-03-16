import { getTranslations } from 'next-intl/server';
import { getDishes } from '@/features/dish/actions/dish-actions';
import { getAuth } from '@/features/auth/queries/get-auth';
import { MenuClient } from '@/features/dish/components/menu-client';
import { ThemeToggle } from '@/components/theme';
import { LanguageToggle } from '@/components/language-toggle';
import { ChevronLeft } from 'lucide-react';

// 页面缓存 60 秒
export const revalidate = 60;

export default async function MenuPage() {
  const t = await getTranslations();

  // 获取菜品列表和登录状态
  const [dishes, { user }] = await Promise.all([
    getDishes(),
    getAuth(),
  ]);

  // 获取用户收藏
  const favorites = new Set<string>();
  if (user) {
    // 获取收藏列表需要额外的查询
    const { getFavoriteDishes } = await import('@/features/dish/actions/dish-actions');
    const favDishes = await getFavoriteDishes();
    favDishes.forEach((dish: any) => favorites.add(dish.id));
  }

  return (
    <MenuClient 
      initialDishes={dishes} 
      initialFavorites={favorites}
    />
  );
}
