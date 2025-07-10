/*
  Warnings:

  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Countrie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `County` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_countrieCode_fkey";

-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_countyId_fkey";

-- DropForeignKey
ALTER TABLE "County" DROP CONSTRAINT "County_countrieCode_fkey";

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "cardCode" DROP NOT NULL;

-- DropTable
DROP TABLE "City";

-- DropTable
DROP TABLE "Countrie";

-- DropTable
DROP TABLE "County";
