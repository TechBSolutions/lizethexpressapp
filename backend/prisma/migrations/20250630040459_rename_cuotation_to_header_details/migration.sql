/*
  Warnings:

  - You are about to drop the column `articleCode` on the `QuotationDetail` table. All the data in the column will be lost.
  - Added the required column `itemCode` to the `QuotationDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuotationDetail" DROP COLUMN "articleCode",
ADD COLUMN     "itemCode" TEXT NOT NULL;
