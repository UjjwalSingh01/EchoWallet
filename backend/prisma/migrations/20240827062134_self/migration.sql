/*
  Warnings:

  - You are about to drop the column `tt_credit` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `tt_debit` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `from_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `from_name` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `to_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `to_name` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Friends` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notification` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CREDIT', 'DEBIT', 'TRANSFER');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('FOOD', 'SHOPPING', 'TRAVEL', 'OTHER');

-- DropIndex
DROP INDEX "Account_userId_key";

-- AlterTable
ALTER TABLE "Account" 
DROP COLUMN "tt_credit",
DROP COLUMN "tt_debit",
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Transaction"
ADD COLUMN "accountId" TEXT NOT NULL,
ADD COLUMN "category" "TransactionCategory" NOT NULL DEFAULT 'OTHER',
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "description" TEXT,
ADD COLUMN "recipientId" TEXT,
ADD COLUMN "type" "TransactionType" NOT NULL DEFAULT 'DEBIT',
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- **Add valid accountId references for existing records:**
UPDATE "Transaction"
SET "accountId" = (SELECT "id" FROM "Account" LIMIT 1)
WHERE "accountId" IS NULL;

-- AlterTable
ALTER TABLE "User"
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Friends";

-- DropTable
DROP TABLE "notification";

-- CreateTable
CREATE TABLE "Friend" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Friend_userId_friendId_key" ON "Friend"("userId", "friendId");

-- AddForeignKey
ALTER TABLE "Transaction" 
ADD CONSTRAINT "Transaction_accountId_fkey" 
FOREIGN KEY ("accountId") 
REFERENCES "Account"("id") 
ON DELETE RESTRICT 
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" 
ADD CONSTRAINT "Friend_userId_fkey" 
FOREIGN KEY ("userId") 
REFERENCES "User"("id") 
ON DELETE RESTRICT 
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" 
ADD CONSTRAINT "Notification_userId_fkey" 
FOREIGN KEY ("userId") 
REFERENCES "User"("id") 
ON DELETE RESTRICT 
ON UPDATE CASCADE;
