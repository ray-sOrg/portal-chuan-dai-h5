import { describe, expect, it } from 'vitest';

import { DISH_CATEGORIES, getCategoryTheme } from '@/features/dish/data/dishes';

describe('dish category metadata', () => {
  it('keeps all menu categories available for navigation', () => {
    expect(DISH_CATEGORIES.map((category) => category.id)).toEqual([
      'APPETIZER',
      'MAIN_COURSE',
      'SOUP',
      'DESSERT',
      'BEVERAGE',
    ]);
  });

  it('maps Sichuan and Dai category themes', () => {
    expect(getCategoryTheme('APPETIZER')).toBe('sichuan');
    expect(getCategoryTheme('MAIN_COURSE')).toBe('sichuan');
    expect(getCategoryTheme('SOUP')).toBe('dai');
    expect(getCategoryTheme('DESSERT')).toBe('dai');
    expect(getCategoryTheme('BEVERAGE')).toBe('dai');
  });
});
