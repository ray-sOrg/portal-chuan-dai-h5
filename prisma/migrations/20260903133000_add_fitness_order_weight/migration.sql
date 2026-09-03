-- Preserve ordinary item quantities while storing fitness meal intake precisely in grams.
ALTER TABLE "OrderItem" ADD COLUMN "weightGrams" DECIMAL(10,2);
