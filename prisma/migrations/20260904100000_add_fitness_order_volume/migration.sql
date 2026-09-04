-- Store liquid fitness meal intake separately from solid-food gram weight.
ALTER TABLE "OrderItem" ADD COLUMN "volumeMl" DECIMAL(10,2);
