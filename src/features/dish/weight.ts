import type { DishNutrition } from './types';

export const MAX_WEIGHT_GRAMS = 10000;
export function isValidWeight(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) &&
    value >= 0.01 && value <= MAX_WEIGHT_GRAMS &&
    Math.abs(value * 100 - Math.round(value * 100)) < 1e-7;
}

export function parseWeight(value: string): number | undefined {
  if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) return undefined;
  const grams = Number(value);
  return isValidWeight(grams) ? grams : undefined;
}

export function hasGramNutrition(nutrition: DishNutrition | null | undefined) {
  return nutrition?.basis === 'PER_100G' && nutrition.servingUnit === 'g';
}

export function nutrientAtWeight(value: number | null, grams: number): number | null {
  return value === null ? null : Math.round(value * grams) / 100;
}

/** Fitness prices are per 100g; ordinary dishes use a unit price. */
export function itemSubtotal(price: number, quantity: number, weightGrams?: number | null) {
  return Math.round((price * (weightGrams == null ? quantity : weightGrams / 100) + Number.EPSILON) * 100) / 100;
}
