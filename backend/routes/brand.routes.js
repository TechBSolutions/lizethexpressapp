const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const brands = await prisma.brand.findMany();
  res.json(brands);
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  const brand = await prisma.brand.create({ data: { name } });
  res.json(brand);
});

module.exports = router;
