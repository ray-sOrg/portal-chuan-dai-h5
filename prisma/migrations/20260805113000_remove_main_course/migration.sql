DELETE FROM "Dish" WHERE "category" = 'MAIN_COURSE';

ALTER TYPE "DishCategory" RENAME TO "DishCategory_old";

CREATE TYPE "DishCategory" AS ENUM (
  'SOUP',
  'BEVERAGE',
  'COLD_DISH',
  'SEASONAL_VEGETABLE',
  'HOT_DISH',
  'OTHER',
  'RECOMMENDED',
  'SNACK_STAPLE',
  'SEAFOOD',
  'BAIJIU',
  'BEER'
);

ALTER TABLE "Dish"
  ALTER COLUMN "category" TYPE "DishCategory"
  USING ("category"::text::"DishCategory");

DROP TYPE "DishCategory_old";
