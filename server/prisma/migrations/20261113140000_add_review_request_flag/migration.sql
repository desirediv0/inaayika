ALTER TABLE "Order" ADD COLUMN "reviewRequestSentAt" TIMESTAMP(3);

-- Orders that already exist must not trigger a surprise review-email blast on first deploy
UPDATE "Order" SET "reviewRequestSentAt" = NOW();
