import { z } from 'zod';

// 用户相关验证
export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

// 菜品相关验证
export const dishSchema = z.object({
  name: z.string().min(1, 'Dish name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.enum(['appetizer', 'main', 'soup']),
  tags: z.array(z.string()),
  spicyLevel: z.number().min(0).max(4).optional(),
  image: z.string().url('Invalid image URL'),
});

// 订单相关验证
export const orderItemSchema = z.object({
  dishId: z.string().min(1, 'Dish ID is required'),
  quantity: z.number().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive'),
  notes: z.string().optional(),
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
  deliveryAddress: z.string().min(10, 'Delivery address is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  notes: z.string().optional(),
});

// 联系表单验证
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

// 搜索验证
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  category: z.enum(['all', 'appetizer', 'main', 'soup']).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().positive().optional(),
  spicyLevel: z.number().min(0).max(4).optional(),
});

// 类型导出
export type UserInput = z.infer<typeof userSchema>;
export type DishInput = z.infer<typeof dishSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
