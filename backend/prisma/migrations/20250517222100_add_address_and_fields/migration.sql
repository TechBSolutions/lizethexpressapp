/*
  Warnings:

  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Customer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cardCode]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[UserWeb]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('PICKUP', 'DELIVERY');

-- DropIndex
DROP INDEX "Customer_email_key";

-- AlterTable
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "id",
DROP COLUMN "name",
DROP COLUMN "phone",
ADD COLUMN     "Address" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "Balance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "CardName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "CardType" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "City" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "CntctPrsn" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "Country" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "Create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "CreditLin" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "Discount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "E_mail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "Modify_Date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "PasswordWeb" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "Phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "Route" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "State" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "Status" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "UserWeb" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ZipCode" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "cardCode" SERIAL NOT NULL,
ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("cardCode");

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "cardCode" INTEGER NOT NULL,
    "idAddress" INTEGER NOT NULL,
    "typeAddress" "AddressType" NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "cntctPerson" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL,
    "modifyDate" TIMESTAMP(3) NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_cardCode_idAddress_key" ON "Address"("cardCode", "idAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_cardCode_key" ON "Customer"("cardCode");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_UserWeb_key" ON "Customer"("UserWeb");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_cardCode_fkey" FOREIGN KEY ("cardCode") REFERENCES "Customer"("cardCode") ON DELETE RESTRICT ON UPDATE CASCADE;
