/*
  Warnings:

  - You are about to drop the column `county` on the `Address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "county",
ADD COLUMN     "reference" TEXT;
