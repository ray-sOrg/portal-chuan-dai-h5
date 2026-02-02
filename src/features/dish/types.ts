// 菜品分类枚举
export type DishCategory = 
  | 'APPETIZER'   // 开胃菜
  | 'MAIN_COURSE' // 主菜
  | 'SOUP'        // 汤品
  | 'DESSERT'     // 甜点
  | 'BEVERAGE';   // 饮品

// 菜品类型（用于前端）
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
