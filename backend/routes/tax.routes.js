const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const taxes = await prisma.tax.findMany();
  res.json(taxes);
});

router.post("/", async (req, res) => {
  const { name, value } = req.body;
  const tax = await prisma.tax.create({ data: { name, value: Number(value) } });
  res.json(tax);
});

module.exports = router;
