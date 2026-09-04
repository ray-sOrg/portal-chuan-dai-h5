import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Dish } from '../dish/types';
import { isValidWeight, itemSubtotal, usesMeasuredAmount, usesVolumeMl } from '../dish/weight';

export interface CartItem {
  dish: Dish;
  quantity: number;
  remark?: string;
  weightGrams?: number;
  volumeMl?: number;
}

interface CartStore {
  items: CartItem[];
  gatheringId?: string;
  gatheringTitle?: string;
  
  // 方法
  addItem: (dish: Dish, quantity?: number, remark?: string) => void;
  addFitnessItem: (dish: Dish, weightGrams: number, remark?: string) => void;
  updateWeight: (dishId: string, weightGrams?: number) => void;
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
        if (usesMeasuredAmount(dish)) return;
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

      addFitnessItem: (dish, measuredAmount, remark) => {
        if (!usesMeasuredAmount(dish) || !isValidWeight(measuredAmount))
          return;
        set((state) => {
          const existing = state.items.find((item) => item.dish.id === dish.id);
          // Reopening a dish edits its requested weight, so repeated clicks never double it.
          const next = {
            dish,
            quantity: 1,
            weightGrams: usesVolumeMl(dish) ? undefined : measuredAmount,
            volumeMl: usesVolumeMl(dish) ? measuredAmount : undefined,
            remark: remark ?? existing?.remark,
          };
          return {
            items: existing
              ? state.items.map((item) =>
                  item.dish.id === dish.id ? next : item
                )
              : [...state.items, next],
          };
        });
      },

      updateWeight: (dishId, measuredAmount) => {
        set((state) => ({ items: state.items.map((item) =>
          item.dish.id === dishId && usesMeasuredAmount(item.dish)
            ? { ...item, quantity: 1,
                weightGrams: !usesVolumeMl(item.dish) && isValidWeight(measuredAmount) ? measuredAmount : undefined,
                volumeMl: usesVolumeMl(item.dish) && isValidWeight(measuredAmount) ? measuredAmount : undefined }
            : item) }));
      },

      removeItem: (dishId) => {
        set((state) => ({
          items: state.items.filter((item) => item.dish.id !== dishId),
        }));
      },

      updateQuantity: (dishId, quantity) => {
        const item = get().items.find((entry) => entry.dish.id === dishId);
        if (item && usesMeasuredAmount(item.dish)) return;
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
          const measuredAmount = usesVolumeMl(item.dish) ? item.volumeMl : item.weightGrams;
          return sum + (usesMeasuredAmount(item.dish) && !isValidWeight(measuredAmount)
            ? 0 : itemSubtotal(price, item.quantity, item.weightGrams, item.volumeMl));
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      version: 1,
      migrate: (persisted) => {
        const state = persisted as Pick<CartStore, 'items' | 'gatheringId' | 'gatheringTitle'>;
        return { ...state, items: (state.items ?? []).map((item) =>
          usesMeasuredAmount(item.dish)
            ? { ...item, quantity: 1, weightGrams: undefined, volumeMl: undefined }
            : item) };
      },
    }
  )
);
