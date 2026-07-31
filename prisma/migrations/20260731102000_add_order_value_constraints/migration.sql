-- Prevent invalid monetary values even if an order is written outside the app.
ALTER TABLE "Order"
ADD CONSTRAINT "Order_totalAmount_nonnegative_check"
CHECK ("totalAmount" >= 0) NOT VALID;

ALTER TABLE "OrderItem"
ADD CONSTRAINT "OrderItem_price_nonnegative_check"
CHECK ("price" >= 0) NOT VALID,
ADD CONSTRAINT "OrderItem_quantity_range_check"
CHECK ("quantity" BETWEEN 1 AND 10) NOT VALID;

ALTER TABLE "Order"
VALIDATE CONSTRAINT "Order_totalAmount_nonnegative_check";

ALTER TABLE "OrderItem"
VALIDATE CONSTRAINT "OrderItem_price_nonnegative_check";

ALTER TABLE "OrderItem"
VALIDATE CONSTRAINT "OrderItem_quantity_range_check";
