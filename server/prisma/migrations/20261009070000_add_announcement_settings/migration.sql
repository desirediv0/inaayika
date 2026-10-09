CREATE TABLE "AnnouncementSettings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "messages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "AnnouncementSettings_pkey" PRIMARY KEY ("id")
);
