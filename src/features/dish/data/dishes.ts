import type { DishCategory } from '../types';

// 菜品类型（用于前端，不依赖 Prisma）
export interface Dish {
  id: string;
  name: string;
  nameEn?: string | null;
  description?: string | null;
  descEn?: string | null;
  price: number;
  image?: string | null;
  category: DishCategory;
  isSpicy: boolean;
  isVegetarian: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  isFavorite?: boolean;
}

// 川菜主题色
export const THEME_COLORS = {
  sichuan: {
    primary: 'bg-red-500',
    secondary: 'bg-red-100',
    text: 'text-red-600',
    border: 'border-red-200',
    tag: 'bg-red-50 text-red-700',
  },
  dai: {
    primary: 'bg-green-500',
    secondary: 'bg-green-100',
    text: 'text-green-600',
    border: 'border-green-200',
    tag: 'bg-green-50 text-green-700',
  },
};

// 菜品分类
export const DISH_CATEGORIES: {
  id: DishCategory;
  labelKey: string;
  theme: 'sichuan' | 'dai';
}[] = [
  { id: 'RECOMMENDED', labelKey: 'menu.categories.recommended', theme: 'sichuan' },
  { id: 'COLD_DISH', labelKey: 'menu.categories.coldDishes', theme: 'dai' },
  { id: 'SEASONAL_VEGETABLE', labelKey: 'menu.categories.seasonalVegetables', theme: 'dai' },
  { id: 'HOT_DISH', labelKey: 'menu.categories.hotDishes', theme: 'sichuan' },
  { id: 'SOUP', labelKey: 'menu.categories.soups', theme: 'dai' },
  { id: 'SNACK_STAPLE', labelKey: 'menu.categories.snacksAndStaples', theme: 'sichuan' },
  { id: 'SEAFOOD', labelKey: 'menu.categories.seafood', theme: 'dai' },
  { id: 'BEVERAGE', labelKey: 'menu.categories.beverages', theme: 'dai' },
  { id: 'BAIJIU', labelKey: 'menu.categories.baijiu', theme: 'sichuan' },
  { id: 'BEER', labelKey: 'menu.categories.beer', theme: 'dai' },
  { id: 'OTHER', labelKey: 'menu.categories.other', theme: 'dai' },
];

// 根据分类获取主题色
export function getCategoryTheme(category: DishCategory): 'sichuan' | 'dai' {
  const cat = DISH_CATEGORIES.find((c) => c.id === category);
  return cat?.theme || 'sichuan';
}
