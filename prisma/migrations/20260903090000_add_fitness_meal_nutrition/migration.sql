-- Additive only: existing dishes, orders and favorites are not modified.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

ALTER TYPE "DishCategory" ADD VALUE IF NOT EXISTS 'FITNESS_MEAL';

CREATE TABLE "DishNutrition" (
  "dishId" UUID NOT NULL PRIMARY KEY,
  "basis" VARCHAR(20) NOT NULL,
  "defaultServingAmount" DECIMAL(10,2) NOT NULL,
  "servingUnit" VARCHAR(10) NOT NULL,
  "caloriesKcal" DECIMAL(10,2) NOT NULL,
  "proteinG" DECIMAL(10,2),
  "carbohydrateG" DECIMAL(10,2),
  "fatG" DECIMAL(10,2),
  "fiberG" DECIMAL(10,2),
  "sugarG" DECIMAL(10,2),
  "sodiumMg" DECIMAL(10,2),
  "labelImageUrl" TEXT,
  CONSTRAINT "DishNutrition_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "DishNutrition_basis_unit_check" CHECK (
    ("basis" = 'PER_100G' AND "servingUnit" = 'g') OR
    ("basis" = 'PER_100ML' AND "servingUnit" = 'ml') OR
    ("basis" = 'PER_SERVING' AND "servingUnit" IN ('piece', 'serving'))
  ),
  CONSTRAINT "DishNutrition_amount_check" CHECK ("defaultServingAmount" > 0 AND "defaultServingAmount" <= 1000000),
  CONSTRAINT "DishNutrition_calories_check" CHECK ("caloriesKcal" BETWEEN 0 AND 1000000),
  CONSTRAINT "DishNutrition_protein_check" CHECK ("proteinG" BETWEEN 0 AND 1000000),
  CONSTRAINT "DishNutrition_carbohydrate_check" CHECK ("carbohydrateG" BETWEEN 0 AND 1000000),
  CONSTRAINT "DishNutrition_fat_check" CHECK ("fatG" BETWEEN 0 AND 1000000),
  CONSTRAINT "DishNutrition_fiber_check" CHECK ("fiberG" BETWEEN 0 AND 1000000),
  CONSTRAINT "DishNutrition_sugar_check" CHECK ("sugarG" BETWEEN 0 AND 1000000),
  CONSTRAINT "DishNutrition_sodium_check" CHECK ("sodiumMg" BETWEEN 0 AND 1000000)
);

-- Access goes through the application servers, not anonymous Supabase clients.
ALTER TABLE "DishNutrition" ENABLE ROW LEVEL SECURITY;
COMMIT;
