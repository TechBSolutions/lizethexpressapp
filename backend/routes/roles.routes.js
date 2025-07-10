// /routes/roles.routes.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar roles
router.get('/', async (req, res) => {
  const roles = await prisma.role.findMany();
  res.json(roles);
});

// Crear rol
router.post('/', async (req, res) => {
  const { name, description, permisos, isSuperadmin } = req.body;
  try {
    const role = await prisma.role.create({
      data: {
        name,
        description,
        permisos,
        isSuperadmin: !!isSuperadmin
      }
    });
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Editar rol
router.put('/:id', async (req, res) => {
  const { name, description, permisos,isSuperadmin } = req.body;
  try {
    const role = await prisma.role.update({
      where: { id: Number(req.params.id) },
      data: { name, description, permisos, isSuperadmin: !!isSuperadmin }
    });
    res.json(role);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar rol
router.delete('/:id', async (req, res) => {
  try {
    await prisma.role.delete({
      where: { id: Number(req.params.id) }
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
