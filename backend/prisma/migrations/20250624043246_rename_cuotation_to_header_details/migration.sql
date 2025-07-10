/*
  Warnings:

  - You are about to drop the `Cuotation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Cuotation";

-- CreateTable
CREATE TABLE "QuotationHeader" (
    "id" SERIAL NOT NULL,
    "docNum" TEXT NOT NULL,
    "cardCode" TEXT NOT NULL,
    "pickupAddress" TEXT NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyDate" TIMESTAMP(3) NOT NULL,
    "pickupDate" TIMESTAMP(3),
    "comment" TEXT,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "totalDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalSum" DOUBLE PRECISION NOT NULL,
    "volumen" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "volumenUnit" TEXT NOT NULL,
    "docTotal" DOUBLE PRECISION NOT NULL,
    "docStatus" "DocStatus" NOT NULL DEFAULT 'O',
    "canceled" "Canceled" NOT NULL DEFAULT 'N',
    "cancelDate" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "QuotationHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationDetail" (
    "id" SERIAL NOT NULL,
    "quotationHeaderId" INTEGER NOT NULL,
    "articleCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "deliveryAddressId" TEXT,
    "totalLine" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "QuotationDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuotationHeader_docNum_key" ON "QuotationHeader"("docNum");

-- AddForeignKey
ALTER TABLE "QuotationDetail" ADD CONSTRAINT "QuotationDetail_quotationHeaderId_fkey" FOREIGN KEY ("quotationHeaderId") REFERENCES "QuotationHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
