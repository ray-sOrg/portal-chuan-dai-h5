-- Existing dishes are intentionally removed before dropping their old enum values.
DELETE FROM "Favorite";
DELETE FROM "Dish";

ALTER TYPE "DishCategory" RENAME TO "DishCategory_old";

CREATE TYPE "DishCategory" AS ENUM (
  'MAIN_COURSE',
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
