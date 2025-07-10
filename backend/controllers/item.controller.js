const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getPrefix = (itemType) => {
  if (itemType === "INV") return "INV";
  if (itemType === "VTA") return "VTA";
  if (itemType === "SER") return "SER";
  return "OTH";
};

// Crear un nuevo producto/item con código autogenerado
const createItem = async (req, res) => {
  try {
    const {
      name,
      description,
      unit,
      size,
      barcode,
      costPrice,
      salePrice,
      wholesalePrice,
      stock,
      minStock,
      location,
      isActive,
      imageUrl,
      itemType,
      batchNumber,
      expirationDate,
      maxDiscount,
      notes,
    } = req.body;

    // Validación básica
    if (!itemType || !name || !description) {
      return res.status(400).json({ error: "itemType, name y description son obligatorios." });
    }

    // Buscar el correlativo más alto actual
    const prefix = getPrefix(itemType);
    const lastItem = await prisma.item.findFirst({
      where: {
        itemCode: {
          startsWith: prefix,
        },
      },
      orderBy: { itemCode: "desc" },
    });

    let nextNumber = 1;
    if (lastItem && lastItem.itemCode.length >= prefix.length + 5) {
      const numberPart = lastItem.itemCode.slice(prefix.length);
      const parsed = parseInt(numberPart, 10);
      if (!isNaN(parsed)) nextNumber = parsed + 1;
    }
    const itemCode = `${prefix}${nextNumber.toString().padStart(5, "0")}`;

    const newItem = await prisma.item.create({
      data: {
        itemCode,
        name,
        description,
        unit,
        size: size ? Number(size) : null,
        barcode,
        costPrice: costPrice ? Number(costPrice) : 0,
        salePrice: salePrice ? Number(salePrice) : 0,
        wholesalePrice: wholesalePrice ? Number(wholesalePrice) : null,
        stock: stock ? Number(stock) : 0,
        minStock: minStock ? Number(minStock) : 0,
        location,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        imageUrl,
        itemType,
        batchNumber,
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        notes,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error al crear item:", error);
    res.status(500).json({ error: "No se pudo crear el producto.", details: error.message });
  }
};

module.exports = {
  createItem,
};
