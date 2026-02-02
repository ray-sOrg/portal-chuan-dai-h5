import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Dish } from '../dish/types';

export interface CartItem {
  dish: Dish;
  quantity: number;
  remark?: string;
}

interface CartStore {
  items: CartItem[];
  gatheringId?: string;
  gatheringTitle?: string;
  
  // 方法
  addItem: (dish: Dish, quantity?: number, remark?: string) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  updateRemark: (dishId: string, remark: string) => void;
  clearCart: () => void;
  setGathering: (id: string, title: string) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      gatheringId: undefined,
      gatheringTitle: undefined,

      addItem: (dish, quantity = 1, remark) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.dish.id === dish.id);
          
          if (existingItem) {
            // 已存在，增加数量
            return {
              items: state.items.map((item) =>
                item.dish.id === dish.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          // 不存在，添加新项
          return {
            items: [...state.items, { dish, quantity, remark }],
          };
        });
      },

      removeItem: (dishId) => {
        set((state) => ({
          items: state.items.filter((item) => item.dish.id !== dishId),
        }));
      },

      updateQuantity: (dishId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(dishId);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.dish.id === dishId ? { ...item, quantity } : item
          ),
        }));
      },

      updateRemark: (dishId, remark) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.dish.id === dishId ? { ...item, remark } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], gatheringId: undefined, gatheringTitle: undefined });
      },

      setGathering: (id, title) => {
        set({ gatheringId: id, gatheringTitle: title });
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => {
          const price = typeof item.dish.price === 'number' 
            ? item.dish.price 
            : Number(item.dish.price);
          return sum + price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
