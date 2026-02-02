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

// Mock 菜品数据
export const MOCK_DISHES: (Dish & { isFavorite?: boolean })[] = [
  // 川菜 - 开胃菜
  {
    id: '1',
    name: '口水鸡',
    nameEn: 'Mouthwatering Chicken',
    description: '经典川菜，鸡肉鲜嫩，麻辣红油浇汁，香气扑鼻',
    descEn: 'Classic Sichuan dish with tender chicken in spicy chili oil',
    price: 38.00,
    image: '/dishes/kou-shui-ji.jpg',
    category: 'APPETIZER',
    isSpicy: true,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },
  {
    id: '2',
    name: '夫妻肺片',
    nameEn: 'Couple\'s Sliced Beef',
    description: '牛杂经典，麻辣鲜香，下酒必备',
    descEn: 'Sliced beef and offal in spicy sauce',
    price: 42.00,
    image: '/dishes/fu-qi-fei-pian.jpg',
    category: 'APPETIZER',
    isSpicy: true,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },
  {
    id: '3',
    name: '凉拌木耳',
    nameEn: 'Wood Ear Salad',
    description: '清爽开胃，黑木耳配酸辣汁',
    descEn: 'Wood ear mushrooms with spicy vinegar dressing',
    price: 22.00,
    image: '/dishes/liang-ban-mu-er.jpg',
    category: 'APPETIZER',
    isSpicy: false,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },

  // 川菜 - 主菜
  {
    id: '4',
    name: '宫保鸡丁',
    nameEn: 'Kung Pao Chicken',
    description: '鸡丁、花生、干辣椒快炒，甜辣交织',
    descEn: 'Diced chicken with peanuts and dried chilies',
    price: 48.00,
    image: '/dishes/gong-bao-ji-ding.jpg',
    category: 'MAIN_COURSE',
    isSpicy: true,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },
  {
    id: '5',
    name: '麻婆豆腐',
    nameEn: 'Mapo Tofu',
    description: '嫩豆腐配牛肉末，麻辣鲜香',
    descEn: 'Silken tofu with minced pork in chili bean sauce',
    price: 28.00,
    image: '/dishes/ma-po-dou-fu.jpg',
    category: 'MAIN_COURSE',
    isSpicy: true,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },
  {
    id: '6',
    name: '水煮牛肉',
    nameEn: 'Boiled Beef in Chili Sauce',
    description: '牛肉片在红油汤中煮熟，麻辣过瘾',
    descEn: 'Sliced beef cooked in spicy chili oil',
    price: 58.00,
    image: '/dishes/shui-zhu-niu-rou.jpg',
    category: 'MAIN_COURSE',
    isSpicy: true,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },
  {
    id: '7',
    name: '回锅肉',
    nameEn: 'Twice-Cooked Pork',
    description: '五花肉先煮后炒，肥而不腻',
    descEn: 'Twice-cooked pork belly with fermented soybeans',
    price: 45.00,
    image: '/dishes/hui-guo-rou.jpg',
    category: 'MAIN_COURSE',
    isSpicy: true,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },
  {
    id: '8',
    name: '鱼香肉丝',
    nameEn: 'Yu Xiang Shredded Pork',
    description: '猪肉丝配木耳丝，酸甜微辣',
    descEn: 'Shredded pork with wood ear mushrooms in garlic sauce',
    price: 32.00,
    image: '/dishes/yu-xiang-rou-si.jpg',
    category: 'MAIN_COURSE',
    isSpicy: false,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },

  // 傣味 - 汤品
  {
    id: '9',
    name: '酸笋鱼汤',
    nameEn: 'Bamboo Shoot Fish Soup',
    description: '傣族特色，酸笋与鱼同煮，开胃解腻',
    descEn: 'Fish soup with fermented bamboo shoots',
    price: 52.00,
    image: '/dishes/suan-sun-yu-tang.jpg',
    category: 'SOUP',
    isSpicy: true,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },
  {
    id: '10',
    name: '柠檬虾',
    nameEn: 'Lemon Shrimp',
    description: '新鲜虾仁配柠檬汁，酸辣清爽',
    descEn: 'Fresh shrimp with lemon and chili',
    price: 48.00,
    image: '/dishes/ning-meng-xia.jpg',
    category: 'SOUP',
    isSpicy: true,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },

  // 傣味 - 主菜
  {
    id: '11',
    name: '香茅草烤鱼',
    nameEn: 'Lemongrass Grilled Fish',
    description: '用香茅草腌制后烤制，香气独特',
    descEn: 'Fish grilled with lemongrass',
    price: 68.00,
    image: '/dishes/xiang-mao-cao-kao-yu.jpg',
    category: 'MAIN_COURSE',
    isSpicy: true,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },
  {
    id: '12',
    name: '傣味鬼鸡',
    nameEn: 'Dai Style Spicy Chicken',
    description: '凉拌鸡肉，酸辣开胃',
    descEn: 'Spicy and sour cold chicken',
    price: 42.00,
    image: '/dishes/dai-wei-gui-ji.jpg',
    category: 'APPETIZER',
    isSpicy: true,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },
  {
    id: '13',
    name: '包烧脑花',
    nameEn: 'Grilled Brain in Banana Leaf',
    description: '用芭蕉叶包烧脑花，风味独特',
    descEn: 'Pig brain grilled in banana leaf',
    price: 35.00,
    image: '/dishes/bao-shao-nao-hua.jpg',
    category: 'MAIN_COURSE',
    isSpicy: true,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },

  // 甜点
  {
    id: '14',
    name: '紫米露',
    nameEn: 'Purple Rice Drink',
    description: '傣族传统甜品，紫米椰浆',
    descEn: 'Purple rice with coconut milk',
    price: 18.00,
    image: '/dishes/zi-mi-lu.jpg',
    category: 'DESSERT',
    isSpicy: false,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },
  {
    id: '15',
    name: '芒果糯米饭',
    nameEn: 'Mango Sticky Rice',
    description: '香甜芒果配椰浆糯米饭',
    descEn: 'Sticky rice with fresh mango and coconut milk',
    price: 25.00,
    image: '/dishes/mang-guo-nuo-mi-fan.jpg',
    category: 'DESSERT',
    isSpicy: false,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },

  // 饮品
  {
    id: '16',
    name: '鲜榨芒果汁',
    nameEn: 'Fresh Mango Juice',
    description: '新鲜芒果现榨',
    descEn: 'Fresh squeezed mango juice',
    price: 15.00,
    image: '/dishes/mang-guo-zha.jpg',
    category: 'BEVERAGE',
    isSpicy: false,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },
  {
    id: '17',
    name: '酸角汁',
    nameEn: 'Tamarind Juice',
    description: '天然酸角熬制，酸甜可口',
    descEn: 'Tamarind drink',
    price: 12.00,
    image: '/dishes/suan-jiao-zhi.jpg',
    category: 'BEVERAGE',
    isSpicy: false,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },
];

// 根据分类获取主题色
export function getCategoryTheme(category: DishCategory): 'sichuan' | 'dai' {
  const cat = DISH_CATEGORIES.find((c) => c.id === category);
  return cat?.theme || 'sichuan';
}
