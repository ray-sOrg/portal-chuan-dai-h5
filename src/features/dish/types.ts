// 菜品分类枚举
export type DishCategory = 
  | 'SOUP'        // 汤品
  | 'BEVERAGE'    // 饮品
  | 'COLD_DISH'   // 凉菜
  | 'SEASONAL_VEGETABLE' // 时令蔬菜
  | 'HOT_DISH'    // 热菜
  | 'OTHER'       // 其他
  | 'FITNESS_MEAL' // 健身餐
  | 'RECOMMENDED' // 推荐
  | 'SNACK_STAPLE' // 小吃主食
  | 'SEAFOOD'     // 海河鲜
  | 'BAIJIU'      // 白酒
  | 'BEER';       // 啤酒

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
