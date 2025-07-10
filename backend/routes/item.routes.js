const express = require("express");
const router = express.Router();
const itemController = require("../controllers/item.controller.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Listar productos y soportar búsqueda por código o descripción (autocompletar)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let where = {};

    if (search) {
      where = {
        OR: [
          { itemCode: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } }
        ]
      };
    }

    const items = await prisma.item.findMany({
      where,
      take: 10, // máximo 10 para autocompletar
      orderBy: {
        itemCode: 'asc'
      }
    });

    res.json(items);
  } catch (err) {
    console.error("Error buscando artículos:", err);
    res.status(500).json({ error: "Error buscando artículos" });
  }
});

// Crear producto (con código autogenerado)
router.post("/", itemController.createItem);

module.exports = router;
