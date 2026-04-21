import { getDishes } from '@/features/dish/actions/dish-actions';
import { getAuth } from '@/features/auth/queries/get-auth';
import { MenuClient } from '@/features/dish/components/menu-client';

// 页面缓存 60 秒
export const revalidate = 60;

export default async function MenuPage() {
  // 获取菜品列表和登录状态
  const [dishes, { user }] = await Promise.all([
    getDishes(),
    getAuth(),
  ]);

  // 获取用户收藏
  const favorites = new Set<string>();
  if (user) {
    const { getFavoriteDishes } = await import('@/features/dish/actions/dish-actions');
    const favDishes = await getFavoriteDishes();
    favDishes.forEach((dish) => favorites.add(dish.id));
  }

  return (
    <MenuClient 
      initialDishes={dishes} 
      initialFavorites={favorites}
    />
  );
}
