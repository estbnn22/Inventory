-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('CREATE_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT');

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meta" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Activity_userId_createdAt_idx" ON "Activity"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Activity_productId_createdAt_idx" ON "Activity"("productId", "createdAt");

-- CreateIndex
CREATE INDEX "Activity_action_createdAt_idx" ON "Activity"("action", "createdAt");
