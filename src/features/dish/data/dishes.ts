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
  { id: 'APPETIZER', labelKey: 'menu.categories.appetizers', theme: 'sichuan' },
  { id: 'MAIN_COURSE', labelKey: 'menu.categories.mainCourses', theme: 'sichuan' },
  { id: 'SOUP', labelKey: 'menu.categories.soups', theme: 'dai' },
  { id: 'DESSERT', labelKey: 'menu.categories.desserts', theme: 'dai' },
  { id: 'BEVERAGE', labelKey: 'menu.categories.beverages', theme: 'dai' },
];

// 根据分类获取主题色
export function getCategoryTheme(category: DishCategory): 'sichuan' | 'dai' {
  const cat = DISH_CATEGORIES.find((c) => c.id === category);
  return cat?.theme || 'sichuan';
}
