const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      cardCode,
      pickupAddress,
      deliveryAddress,
      pickupDate,
      comment,
      discount,
      volumen,
      volumenUnit,
      createdBy,
      items
    } = req.body;

    // Validaciones simples
    if (!cardCode || !pickupAddress || !deliveryAddress || !pickupDate || !createdBy || !items || items.length === 0) {
      return res.status(400).json({ error: "Faltan campos obligatorios o detalle vacío." });
    }

    // Generar docNum
    const count = await prisma.quotationHeader.count({ where: { cardCode } });
    const correlativo = String(count + 1).padStart(7, '0');
    const docNum = `${cardCode}-${correlativo}`;

    // Calcular totales
    const enrichedItems = items.map(i => ({
      ...i,
      totalLine: i.quantity * i.salePrice
    }));
    const totalSum = enrichedItems.reduce((acc, i) => acc + i.totalLine, 0);
    const totalDiscount = discount || 0;
    const docTotal = totalSum - totalDiscount;

    // Insertar en DB
    const quotation = await prisma.quotationHeader.create({
      data: {
        docNum,
        cardCode,
        pickupAddress,
        deliveryAddress,
        pickupDate: pickupDate ? new Date(pickupDate) : null,
        comment,
        discount,
        totalDiscount,
        totalSum,
        volumen,
        volumenUnit,
        docTotal,
        createdBy,
        docStatus: "O",
        canceled: "N",
        details: {
          create: enrichedItems.map(item => ({
            itemCode: item.itemCode,   // <-- Así coincide con Prisma
            description: item.description,
            unit: item.unit,
            quantity: item.quantity,
            salePrice: item.salePrice,
            deliveryAddressId: item.deliveryAddress,
            totalLine: item.totalLine
          }))
        }
        
      }
    });

    res.status(201).json({ message: "Pedido creado exitosamente", docNum, id: quotation.id });
  } catch (error) {
    console.error("Error creando pedido:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// quotation.routes.js

router.get('/correlativo', async (req, res) => {
  const { cardCode } = req.query;
  if (!cardCode) return res.status(400).json({ error: "cardCode requerido" });
  try {
    const count = await prisma.quotationHeader.count({ where: { cardCode } });
    const correlativo = String(count + 1).padStart(7, '0');
    const docNum = `${cardCode}-${correlativo}`;
    res.json({ docNum });
  } catch (err) {
    res.status(500).json({ error: "No se pudo generar correlativo" });
  }
});


module.exports = router;
