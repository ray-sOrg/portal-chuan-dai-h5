'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Dish } from '@/types';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartActions {
  addItem: (dish: Dish, quantity?: number) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (dishId: string) => number;
}

type CartStore = CartState & CartActions;

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (dish: Dish, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.dishId === dish.id);
          
          let newItems: CartItem[];
          if (existingItem) {
            newItems = state.items.map(item =>
              item.dishId === dish.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            const newItem: CartItem = {
              dishId: dish.id,
              quantity,
              price: dish.price,
              dish,
            };
            newItems = [...state.items, newItem];
          }

          return {
            items: newItems,
            total: calculateTotal(newItems),
            itemCount: calculateItemCount(newItems),
          };
        });
      },

      removeItem: (dishId: string) => {
        set((state) => {
          const newItems = state.items.filter(item => item.dishId !== dishId);
          return {
            items: newItems,
            total: calculateTotal(newItems),
            itemCount: calculateItemCount(newItems),
          };
        });
      },

      updateQuantity: (dishId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(dishId);
          return;
        }

        set((state) => {
          const newItems = state.items.map(item =>
            item.dishId === dishId
              ? { ...item, quantity }
              : item
          );
          return {
            items: newItems,
            total: calculateTotal(newItems),
            itemCount: calculateItemCount(newItems),
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          total: 0,
          itemCount: 0,
        });
      },

      getItemQuantity: (dishId: string) => {
        const item = get().items.find(item => item.dishId === dishId);
        return item?.quantity || 0;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
      }),
    }
  )
);
