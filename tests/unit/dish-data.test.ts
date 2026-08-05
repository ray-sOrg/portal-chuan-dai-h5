import { describe, expect, it } from 'vitest';

import { DISH_CATEGORIES, getCategoryTheme } from '@/features/dish/data/dishes';

describe('dish category metadata', () => {
  it('keeps all menu categories available for navigation', () => {
    expect(DISH_CATEGORIES.map((category) => category.id)).toEqual([
      'RECOMMENDED',
      'COLD_DISH',
      'SEASONAL_VEGETABLE',
      'HOT_DISH',
      'SOUP',
      'SNACK_STAPLE',
      'SEAFOOD',
      'BEVERAGE',
      'BAIJIU',
      'BEER',
      'OTHER',
    ]);
  });

  it('maps Sichuan and Dai category themes', () => {
    expect(getCategoryTheme('RECOMMENDED')).toBe('sichuan');
    expect(getCategoryTheme('COLD_DISH')).toBe('dai');
    expect(getCategoryTheme('SEASONAL_VEGETABLE')).toBe('dai');
    expect(getCategoryTheme('HOT_DISH')).toBe('sichuan');
    expect(getCategoryTheme('SOUP')).toBe('dai');
    expect(getCategoryTheme('SNACK_STAPLE')).toBe('sichuan');
    expect(getCategoryTheme('SEAFOOD')).toBe('dai');
    expect(getCategoryTheme('BEVERAGE')).toBe('dai');
    expect(getCategoryTheme('BAIJIU')).toBe('sichuan');
    expect(getCategoryTheme('BEER')).toBe('dai');
    expect(getCategoryTheme('OTHER')).toBe('dai');
  });
});
