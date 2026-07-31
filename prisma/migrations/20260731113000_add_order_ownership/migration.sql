-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('GUEST', 'HOST');

-- AlterTable
ALTER TABLE "User"
ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'GUEST';

-- The existing private deployment has one bootstrap user. Promote it without
-- guessing when a different database contains multiple users.
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM "User") = 1 THEN
        UPDATE "User" SET "role" = 'HOST';
    END IF;
END
$$;

-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "hostId" UUID,
ADD COLUMN "gatheringId" UUID;

UPDATE "Order"
SET "hostId" = (
    SELECT "id"
    FROM "User"
    WHERE "role" = 'HOST'
    ORDER BY "createdAt"
    LIMIT 1
)
WHERE "hostId" IS NULL;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Order" WHERE "hostId" IS NULL) THEN
        RAISE EXCEPTION 'Cannot migrate existing orders without a configured HOST user';
    END IF;
END
$$;

ALTER TABLE "Order"
ALTER COLUMN "hostId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Order_hostId_idx" ON "Order"("hostId");
CREATE INDEX "Order_gatheringId_idx" ON "Order"("gatheringId");
CREATE INDEX "Order_customerId_createdAt_idx" ON "Order"("customerId", "createdAt");
CREATE INDEX "Order_hostId_status_createdAt_idx" ON "Order"("hostId", "status", "createdAt");

-- AddForeignKey
ALTER TABLE "Order"
ADD CONSTRAINT "Order_customerId_fkey"
FOREIGN KEY ("customerId") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Order"
ADD CONSTRAINT "Order_hostId_fkey"
FOREIGN KEY ("hostId") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Order"
ADD CONSTRAINT "Order_gatheringId_fkey"
FOREIGN KEY ("gatheringId") REFERENCES "Gathering"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Gathering"
ADD CONSTRAINT "Gathering_hostId_fkey"
FOREIGN KEY ("hostId") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
