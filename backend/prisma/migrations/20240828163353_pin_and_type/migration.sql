/*
  Warnings:

  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pin` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "type" "TransactionType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pin" TEXT NOT NULL;
