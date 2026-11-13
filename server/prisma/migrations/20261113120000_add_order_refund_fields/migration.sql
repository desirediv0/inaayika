ALTER TABLE "Order"
  ADD COLUMN "cancelledByRole" TEXT,
  ADD COLUMN "refundMethod" TEXT,
  ADD COLUMN "refundStatus" TEXT,
  ADD COLUMN "refundAmount" DECIMAL(10,2),
  ADD COLUMN "refundedAt" TIMESTAMP(3);
