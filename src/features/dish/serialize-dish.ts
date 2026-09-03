import type { Prisma } from '@prisma/client';
import type { Dish } from './types';

type DishWithNutrition = Prisma.DishGetPayload<{ include: { nutrition: true } }>;
export function serializeDish(dish: DishWithNutrition): Dish {
  const n = dish.nutrition;
  return {
    ...dish,
    price: dish.price.toNumber(),
    nutrition: n ? {
      basis: n.basis,
      servingUnit: n.servingUnit,
      defaultServingAmount: n.defaultServingAmount.toNumber(),
      caloriesKcal: n.caloriesKcal.toNumber(),
      proteinG: n.proteinG?.toNumber() ?? null,
      carbohydrateG: n.carbohydrateG?.toNumber() ?? null,
      fatG: n.fatG?.toNumber() ?? null,
      fiberG: n.fiberG?.toNumber() ?? null,
      sugarG: n.sugarG?.toNumber() ?? null,
      sodiumMg: n.sodiumMg?.toNumber() ?? null,
      labelImageUrl: n.labelImageUrl,
    } : null,
  };
}
