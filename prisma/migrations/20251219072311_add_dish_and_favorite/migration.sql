-- CreateEnum
CREATE TYPE "DishCategory" AS ENUM ('APPETIZER', 'MAIN_COURSE', 'SOUP', 'DESSERT', 'BEVERAGE');

-- CreateTable
CREATE TABLE "Dish" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" VARCHAR(500),
    "descEn" VARCHAR(500),
    "price" DECIMAL(10,2) NOT NULL,
    "image" TEXT,
    "category" "DishCategory" NOT NULL,
    "isSpicy" BOOLEAN NOT NULL DEFAULT false,
    "isVegetarian" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "dishId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_dishId_idx" ON "Favorite"("dishId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_dishId_key" ON "Favorite"("userId", "dishId");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;
