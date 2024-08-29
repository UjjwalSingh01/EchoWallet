/*
  Warnings:

  - You are about to drop the column `date` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `from_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `from_name` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `to_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `to_name` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "date",
DROP COLUMN "from_id",
DROP COLUMN "from_name",
DROP COLUMN "to_id",
DROP COLUMN "to_name";
