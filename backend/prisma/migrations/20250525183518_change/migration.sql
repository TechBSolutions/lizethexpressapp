/*
  Warnings:

  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[IDcard]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_cardCode_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "cardCode" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Cuotation" ALTER COLUMN "cardCode" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_pkey",
ADD COLUMN     "IDcard" SERIAL NOT NULL,
ALTER COLUMN "cardCode" DROP DEFAULT,
ALTER COLUMN "cardCode" SET DATA TYPE TEXT,
ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("IDcard");
DROP SEQUENCE "Customer_cardCode_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Customer_IDcard_key" ON "Customer"("IDcard");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_cardCode_fkey" FOREIGN KEY ("cardCode") REFERENCES "Customer"("cardCode") ON DELETE RESTRICT ON UPDATE CASCADE;
