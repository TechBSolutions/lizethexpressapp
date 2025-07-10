const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const suppliers = await prisma.supplier.findMany();
  res.json(suppliers);
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  const supplier = await prisma.supplier.create({ data: { name } });
  res.json(supplier);
});

module.exports = router;
