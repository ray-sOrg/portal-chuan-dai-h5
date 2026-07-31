-- Reconcile schema changes that were previously applied with db push.
-- Every statement is safe to run against the existing production schema.

-- CreateEnum
DO $$
BEGIN
    CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLEED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;

-- AlterTable
ALTER TABLE "Gathering"
ADD COLUMN IF NOT EXISTS "hostId" UUID,
ADD COLUMN IF NOT EXISTS "inviteCode" TEXT,
ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true;

UPDATE "Gathering"
SET "isActive" = true
WHERE "isActive" IS NULL;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Gathering" WHERE "hostId" IS NULL) THEN
        RAISE EXCEPTION 'Cannot require Gathering.hostId while legacy rows have no host';
    END IF;
END
$$;

ALTER TABLE "Gathering"
ALTER COLUMN "hostId" SET NOT NULL,
ALTER COLUMN "isActive" SET DEFAULT true,
ALTER COLUMN "isActive" SET NOT NULL;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Order" (
    "id" UUID NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerId" UUID NOT NULL,
    "customerName" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "remark" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "dishId" UUID NOT NULL,
    "dishName" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "remark" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE INDEX IF NOT EXISTS "Order_customerId_idx" ON "Order"("customerId");
CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order"("status");
CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE UNIQUE INDEX IF NOT EXISTS "Gathering_inviteCode_key" ON "Gathering"("inviteCode");
CREATE INDEX IF NOT EXISTS "Gathering_inviteCode_idx" ON "Gathering"("inviteCode");
CREATE INDEX IF NOT EXISTS "Gathering_hostId_idx" ON "Gathering"("hostId");

-- AddForeignKey
DO $$
BEGIN
    ALTER TABLE "OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "Order"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;
