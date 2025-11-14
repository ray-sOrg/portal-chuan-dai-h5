// 全局类型定义
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'appetizer' | 'main' | 'soup';
  tags: string[];
  spicyLevel?: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  createdAt: Date;
}

export interface OrderItem {
  dishId: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface CartItem extends OrderItem {
  dish: Dish;
}

// 组件 Props 类型
export interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
