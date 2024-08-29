/*
  Warnings:

  - You are about to drop the column `to` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - Added the required column `from_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_name` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_name` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "to",
DROP COLUMN "userId",
ADD COLUMN     "from_id" TEXT NOT NULL,
ADD COLUMN     "from_name" TEXT NOT NULL,
ADD COLUMN     "to_id" TEXT NOT NULL,
ADD COLUMN     "to_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone",
ALTER COLUMN "lastname" DROP NOT NULL;
