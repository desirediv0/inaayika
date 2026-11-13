ALTER TABLE "FlashSale" ADD COLUMN "saleAlertSentAt" TIMESTAMP(3);

-- Sales that already exist must not trigger a surprise email blast on first deploy
UPDATE "FlashSale" SET "saleAlertSentAt" = NOW();
