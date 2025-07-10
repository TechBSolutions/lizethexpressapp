// backend/controllers/address.controller.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todas las direcciones (con filtro opcional por cardCode y tipo)
const getAddresses = async (req, res) => {
  const { cardCode, TypeAddress } = req.query;
  try {
    const where = {};
    if (cardCode) where.cardCode = cardCode;
    if (TypeAddress === '1') where.typeAddress = 'PICKUP';
    if (TypeAddress === '2') where.typeAddress = 'DELIVERY';

    const addresses = await prisma.address.findMany({ where });
    res.json(addresses);
  } catch (error) {
    console.error("Error al consultar direcciones:", error);
    res.status(500).json({ error: 'Failed to retrieve addresses.' });
  }
};

// Obtener una dirección por ID
const getAddressById = async (req, res) => {
  try {
    const { idAddress } = req.params;
    const address = await prisma.address.findUnique({
      where: { id: Number(idAddress) }
    });
    if (!address) return res.status(404).json({ error: "No encontrada" });
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: "No se pudo consultar la dirección", details: err.message });
  }
};

// Crear dirección
const createAddress = async (req, res) => {
  try {
    const address = await prisma.address.create({
      data: {
        cardCode: req.body.cardCode,
        typeAddress: req.body.typeAddress, // Enum "PICKUP" o "DELIVERY"
        cntctPerson: req.body.cntctPerson,
        phone: req.body.phone,
        country: req.body.country || req.body.Country,
        state: req.body.state || req.body.State,
        city: req.body.city || req.body.City,
        latitude: req.body.latitude || "",
        longitude: req.body.longitude || "",
        zipCode: req.body.zipCode,
        street: req.body.street,
        address1: req.body.address1,
        address2: req.body.address2,
        reference: req.body.reference,
        createDate: new Date(),
        modifyDate: new Date(),
        status: "Activo", // Si tienes status, de lo contrario usa isActive: true
      }
    });
    res.status(201).json(address);
  } catch (error) {
    console.error("Error al crear dirección:", error);
    res.status(500).json({ error: 'No se pudo crear la dirección', details: error.message });
  }
};

// Actualizar dirección
const updateAddress = async (req, res) => {
  try {
    const { idAddress } = req.params;
    const data = req.body;
    if (data.idAddress) delete data.idAddress;
    if (data.cardCode) delete data.cardCode;
    const updated = await prisma.address.update({
      where: { idAddress: Number(idAddress) },
      data
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "No se pudo actualizar la dirección", details: err.message });
  }
};

// Deshabilitar dirección
const disableAddress = async (req, res) => {
  try {
    const { idAddress } = req.params;
    const updated = await prisma.address.update({
      where: { idAddress: Number(idAddress) },
      data: { status: "Inactivo" }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "No se pudo deshabilitar la dirección", details: err.message });
  }
};

// Habilitar dirección
const enableAddress = async (req, res) => {
  try {
    const { idAddress } = req.params;
    const updated = await prisma.address.update({
      where: { idAddress: Number(idAddress) },
      data: { status: "Activo" }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "No se pudo habilitar la dirección", details: err.message });
  }
};

module.exports = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  disableAddress,
  enableAddress
};
