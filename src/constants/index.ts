// 应用常量
export const APP_CONFIG = {
  name: 'Chuan-Dai',
  description: 'A Family-Style Sichuan Restaurant with Dai Ethnic Flavors',
  version: '1.0.0',
  author: 'Chuan-Dai Team',
} as const;

// 路由常量
export const ROUTES = {
  HOME: '/',
  MENU: '/menu',
  PHOTO: '/photo',
  PROFILE: '/profile',
} as const;

// 支持的语言
export const LOCALES = ['en', 'zh'] as const;
export const DEFAULT_LOCALE = 'en' as const;

// 菜品分类
export const DISH_CATEGORIES = {
  APPETIZER: 'appetizer',
  MAIN: 'main',
  SOUP: 'soup',
} as const;

// 订单状态
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
} as const;

// 辣度等级
export const SPICY_LEVELS = {
  MILD: 1,
  MEDIUM: 2,
  HOT: 3,
  EXTRA_HOT: 4,
} as const;

// 价格范围
export const PRICE_RANGE = {
  MIN: 5,
  MAX: 50,
} as const;

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
} as const;
