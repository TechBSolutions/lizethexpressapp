/*
  Warnings:

  - You are about to drop the column `brandId` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `taxId` on the `items` table. All the data in the column will be lost.
  - You are about to drop the `brands` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `suppliers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `taxes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_brandId_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_taxId_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "brandId",
DROP COLUMN "categoryId",
DROP COLUMN "supplierId",
DROP COLUMN "taxId";

-- DropTable
DROP TABLE "brands";

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "suppliers";

-- DropTable
DROP TABLE "taxes";
