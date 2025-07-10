const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { getEffectivePermissions } = require('../utils/permissions');
const prisma = new PrismaClient();

// Listar usuarios (incluye rol)
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { role: true }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un usuario por id
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: { role: true }
    });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear usuario
router.post('/', async (req, res) => {
  try {
    let { username, email, password, roleId, permisosExtra } = req.body;

    // Validación simple
    if (!username || !email || !password || !roleId)
      return res.status(400).json({ error: "Todos los campos son obligatorios (usuario, email, contraseña, rol)" });

    roleId = Number(roleId);

    // Prisma requiere Int para roleId
    const user = await prisma.user.create({
      data: { username, email, password, roleId, permisosExtra }
    });
    res.status(201).json(user);
  } catch (err) {
    // Devuelve mensaje detallado de Prisma
    res.status(400).json({ error: err.message });
  }
});

// Editar usuario (puede cambiar rol o permisos extra)
router.put('/:id', async (req, res) => {
  try {
    let { username, email, password, roleId, permisosExtra } = req.body;
    roleId = Number(roleId);

    if (!username || !email || !roleId)
      return res.status(400).json({ error: "Usuario, email y rol son obligatorios" });

    const dataToUpdate = { username, email, roleId, permisosExtra };
    if (password) dataToUpdate.password = password;

    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: dataToUpdate
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: Number(req.params.id) }
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener permisos efectivos del usuario (rol + overrides)
router.get('/:id/permissions', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: { role: true }
    });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Si el rol es superadmin, acceso total
    if (user.role.isSuperadmin) {
      return res.json({ isSuperadmin: true });
    }

    const perms = getEffectivePermissions(user.role.permisos, user.permisosExtra);
    res.json(perms);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
