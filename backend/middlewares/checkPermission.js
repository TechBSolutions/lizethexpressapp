// /middlewares/checkPermission.js
const { PrismaClient } = require('@prisma/client');
const { getEffectivePermissions } = require('../utils/permissions');
const prisma = new PrismaClient();

function checkPermission(moduleName, action) {
  return async (req, res, next) => {
    // Asume que ya tienes autenticación y el usuario en req.user
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true }
    });

    // SUPERADMIN: acceso a todo
    if (user.role.isSuperadmin) {
      return next();
    }

    if (!user) return res.status(401).json({ error: 'No autorizado' });

    const perms = getEffectivePermissions(user.role.permisos, user.permisosExtra);

    if (perms[moduleName] && perms[moduleName][action]) {
      return next();
    }
    return res.status(403).json({ error: 'No tienes permiso para esta acción' });
  };
}

module.exports = { checkPermission };
