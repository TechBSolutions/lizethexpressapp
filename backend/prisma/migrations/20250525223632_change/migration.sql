-- AlterTable
CREATE SEQUENCE address_idaddress_seq;
ALTER TABLE "Address" ALTER COLUMN "idAddress" SET DEFAULT nextval('address_idaddress_seq');
ALTER SEQUENCE address_idaddress_seq OWNED BY "Address"."idAddress";
