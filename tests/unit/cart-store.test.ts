import { beforeEach, describe, expect, it } from 'vitest';

import { useCartStore } from '@/features/cart/store';
import type { Dish } from '@/features/dish/types';

const dish: Dish = {
  id: 'dish-1',
  name: '麻婆豆腐',
  price: 28,
  category: 'HOT_DISH',
  isSpicy: true,
  isVegetarian: false,
  isAvailable: true,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

const fitnessDish: Dish = {
  ...dish,
  id: 'fitness-1',
  name: '希腊式酸奶',
  category: 'FITNESS_MEAL',
  price: 12,
};

describe('cart store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('adds duplicate dishes by increasing quantity', () => {
    useCartStore.getState().addItem(dish, 1);
    useCartStore.getState().addItem(dish, 2);

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().getItemCount()).toBe(3);
    expect(useCartStore.getState().getTotal()).toBe(84);
  });

  it('removes items when quantity is updated to zero', () => {
    useCartStore.getState().addItem(dish, 1);
    useCartStore.getState().updateQuantity(dish.id, 0);

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('stores gathering context and clears it with the cart', () => {
    useCartStore.getState().setGathering('gathering-1', '家庭聚餐');

    expect(useCartStore.getState().gatheringTitle).toBe('家庭聚餐');

    useCartStore.getState().clearCart();

    expect(useCartStore.getState().gatheringId).toBeUndefined();
    expect(useCartStore.getState().gatheringTitle).toBeUndefined();
  });

  it('stores fitness meals by grams and prices them per 100g', () => {
    useCartStore.getState().addFitnessItem(fitnessDish, 150);
    expect(useCartStore.getState().items[0]).toMatchObject({ quantity: 1, weightGrams: 150 });
    expect(useCartStore.getState().getTotal()).toBe(18);

    useCartStore.getState().addFitnessItem(fitnessDish, 80);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].weightGrams).toBe(80);
  });
});
