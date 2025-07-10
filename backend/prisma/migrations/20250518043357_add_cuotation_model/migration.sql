-- CreateEnum
CREATE TYPE "DocType" AS ENUM ('I', 'S');

-- CreateEnum
CREATE TYPE "Canceled" AS ENUM ('Y', 'N');

-- CreateEnum
CREATE TYPE "DocStatus" AS ENUM ('O', 'C');

-- CreateTable
CREATE TABLE "Cuotation" (
    "docEntry" SERIAL NOT NULL,
    "docNum" INTEGER NOT NULL,
    "docType" "DocType" NOT NULL,
    "canceled" "Canceled" NOT NULL,
    "docStatus" "DocStatus" NOT NULL,
    "pickupAddress" TEXT NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "cardCode" INTEGER NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyDate" TIMESTAMP(3) NOT NULL,
    "totalSum" DOUBLE PRECISION NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "totalDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "volumen" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "docTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pickUpDate" TIMESTAMP(3),
    "comment" TEXT,
    "volumenUnit" TEXT NOT NULL,
    "cancelDate" TIMESTAMP(3),

    CONSTRAINT "Cuotation_pkey" PRIMARY KEY ("docEntry")
);
