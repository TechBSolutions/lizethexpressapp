const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // 1. Traer pedidos abiertos
    const pedidos = await prisma.quotationHeader.findMany({
      where: { docStatus: 'O' },
      include: { details: true },
      orderBy: { createDate: 'desc' }
    });

    // 2. Sacar cardCodes y deliveryAddress únicos
    const cardAddresses = pedidos.map(p => ({
      cardCode: p.cardCode,
      IdAddress: p.deliveryAddress // el campo en quotationHeader
    }));

    // Filtra las combinaciones únicas para no hacer queries de más
    const combosUnicos = Array.from(
        new Set(cardAddresses.map(ca => `${ca.cardCode}|${ca.IdAddress}`))
      ).map(str => {
        const [cardCode, IdAddress] = str.split('|');
        return { cardCode, IdAddress: Number(IdAddress) };  // CONVERTIR AQUÍ
      }).filter(c => !!c.IdAddress && !isNaN(c.IdAddress));

    // 3. Traer addresses de la base de datos para esas combinaciones
    //    address debe tener cardcode, idaddress y country
    const addresses = await prisma.address.findMany({
        where: {
          OR: combosUnicos.map(c => ({
            cardCode: c.cardCode,
            idAddress: Number(c.IdAddress)   // <-- ¡Aquí lo convertimos!
          }))
        },
        select: {
          cardCode: true,
          idAddress: true,
          country: true
        }
      });
      
      
      const addressMap = {};
      addresses.forEach(addr => {
        addressMap[`${addr.cardCode}|${addr.idAddress}`] = addr.country;
      });
      

    // 5. Saca los cardCodes y busca los nombres
    const cardCodes = pedidos.map(p => p.cardCode);
    const customers = await prisma.customer.findMany({
      where: { cardCode: { in: cardCodes } },
      select: { cardCode: true, CardName: true }
    });
    const customerMap = {};
    customers.forEach(c => {
      customerMap[c.cardCode] = c.CardName;
    });

    // 6. Responde al frontend con todo mapeado
    const result = pedidos.map(p => ({
      NumeroDocumento: p.docNum,
      NumeroPedido: p.id,
      CodigoCliente: p.cardCode,
      NombreCliente: customerMap[p.cardCode] || '',
      PaisEntrega: addressMap[`${p.cardCode}|${p.deliveryAddress}`] || '',
      CantidadItems: p.details ? p.details.length : 0,
      FechaPedido: p.createDate,
      FechaRecoleccion: p.pickupDate,
      TotalPedido: p.docTotal,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error trayendo pedidos abiertos:", err);
    res.status(500).json({ error: "Error trayendo pedidos abiertos" });
  }
});

module.exports = router;
