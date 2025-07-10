import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import PermissionMatrix from "@/components/PermissionMatrix";

// IMPORTA MODULES Y PERMISSION_TYPES IGUAL QUE EN RoleForm.jsx
const MODULES = [
  {
    key: "ventas", label: "Ventas",
    children: [
      { key: "pedidos", label: "Pedidos" },
      { key: "facturacion", label: "Facturación" },
      { key: "reportes", label: "Reportes" },
      { key: "historial", label: "Historial de Pedidos" },
      { key: "clientesFrecuentes", label: "Clientes Frecuentes" },
      { key: "cotizaciones", label: "Cotizaciones" },
    ]
  },
  {
    key: "inventario", label: "Inventario",
    children: [
      { key: "paquetesClientes", label: "Paquetes de Clientes" },
      { key: "productosInternos", label: "Productos Internos" },
      { key: "almacenes", label: "Almacenes" },
      { key: "adminProductos", label: "Administración de Productos" },
    ]
  },
  {
    key: "clientes", label: "Clientes",
    children: [
      { key: "listado", label: "Listado de Clientes" },
      { key: "detalle", label: "Detalle de Cliente" },
      { key: "crearEditar", label: "Crear/Editar Cliente" },
      { key: "direcciones", label: "Direcciones" },
    ]
  },
  {
    key: "logistica", label: "Logística",
    children: [
      { key: "flota", label: "Flota Vehicular" },
      { key: "motoristas", label: "Motoristas" },
      { key: "recoleccion", label: "Recolección" },
      { key: "rutas", label: "Rutas" },
    ]
  },
  {
    key: "configuracion", label: "Configuración",
    children: [
      { key: "parametros", label: "Parámetros Generales" },
      { key: "usuarios", label: "Usuarios" },
      { key: "roles", label: "Perfiles y Roles" },
      { key: "catalogos", label: "Catálogos y Listas" },
      { key: "auditoria", label: "Auditoría" },
      { key: "integraciones", label: "Integraciones" },
    ]
  }
];

const PERMISSION_TYPES = [
  { key: "read", label: "Ver" },
  { key: "create", label: "Crear" },
  { key: "update", label: "Editar" },
  { key: "delete", label: "Eliminar" },
  { key: "enable", label: "Habilitar" },
  { key: "report", label: "Reportes" },
  { key: "config", label: "Configurar" }
];

function buildDefaultPermissions() {
  const obj = {};
  for (const mod of MODULES) {
    obj[mod.key] = {};
    for (const sub of mod.children) {
      obj[mod.key][sub.key] = {};
      for (const perm of PERMISSION_TYPES) {
        obj[mod.key][sub.key][perm.key] = false;
      }
    }
  }
  return obj;
}

// NUEVO: función auxiliar para merge de permisos base del rol
function buildPermissionsFromRole(rolPerms = {}) {
  const base = buildDefaultPermissions();
  for (const mod in rolPerms) {
    if (!base[mod]) continue;
    for (const sub in rolPerms[mod]) {
      if (!base[mod][sub]) continue;
      base[mod][sub] = { ...base[mod][sub], ...(rolPerms[mod][sub] || {}) };
    }
  }
  return base;
}

export default function UserForm() {
  const { id } = useParams();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    roleId: "",
    permisosExtra: buildDefaultPermissions()
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState("");
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  // NUEVO: permisos base del rol seleccionado
  const [rolePerms, setRolePerms] = useState(buildDefaultPermissions());
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/roles")
      .then(res => res.json())
      .then(data => setRoles(data));

    if (id) {
      fetch(`/api/users/${id}`)
        .then(res => res.json())
        .then(data => {
          setUser({
            username: data.username,
            email: data.email,
            password: "",
            roleId: data.roleId,
            permisosExtra: data.permisosExtra || buildDefaultPermissions()
          });
          setIsSuperadmin(data.role?.isSuperadmin || false);
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    // Cuando cambia el rol, busca el objeto permisos base de ese rol
    const selectedRole = roles.find(r => r.id === Number(user.roleId));
    setIsSuperadmin(!!selectedRole?.isSuperadmin);
    if (!!selectedRole?.isSuperadmin) {
      setUser(u => ({ ...u, permisosExtra: buildDefaultPermissions() }));
      setRolePerms(buildDefaultPermissions());
    } else if (selectedRole) {
      setRolePerms(buildPermissionsFromRole(selectedRole.permisos || {}));
    } else {
      setRolePerms(buildDefaultPermissions());
    }
  }, [user.roleId, roles]);

  const handleChange = e => setUser({ ...user, [e.target.name]: e.target.value });
  const handlePermisosChange = perms => setUser({ ...user, permisosExtra: perms });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!user.username || !user.email || !user.roleId) {
      setError("Usuario, email y rol son obligatorios");
      return;
    }
    const method = id ? "PUT" : "POST";
    const url = id ? `/api/users/${id}` : "/api/users";
    const payload = { ...user, roleId: Number(user.roleId) };
    if (!user.password) delete payload.password;
    if (isSuperadmin) payload.permisosExtra = null;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      navigate("/config/users");
    } else {
      let errMsg = "Error al guardar el usuario";
      try {
        const errJson = await res.json();
        errMsg = errJson.error || errMsg;
      } catch (e) {}
      setError(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2471a3] to-[#34495e] p-8">
      <header className="flex justify-between items-center mb-8">
        <Button onClick={() => navigate("/config/users")} className="bg-primary text-white hover:bg-secondary">
          {"<"}
        </Button>
        <h1 className="text-3xl font-bold text-white">{id ? "Editar Usuario" : "Nuevo Usuario"}</h1>
        <span />
      </header>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl w-full mx-auto">
        {loading ? (
          <div className="text-gray-500">Cargando...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-600">{error}</div>}
            <div>
              <label className="block text-sm font-medium mb-1">Usuario</label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña {id ? "(déjalo vacío para no cambiar)" : ""}</label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                autoComplete="new-password"
                required={!id}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rol</label>
              <select
                name="roleId"
                value={user.roleId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Selecciona un rol...</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name} {role.isSuperadmin ? " (Superadmin)" : ""}
                  </option>
                ))}
              </select>
            </div>
            {user.roleId && !isSuperadmin ? (
              <div className="overflow-x-auto">
                <label className="block text-sm font-medium mb-1">Permisos adicionales (overrides)</label>
                <PermissionMatrix
                  value={user.permisosExtra}
                  lockedPermissions={rolePerms}
                  onChange={handlePermisosChange}
                  modules={MODULES}
                  permissionTypes={PERMISSION_TYPES}
                />
                <span className="text-xs text-gray-400">
                  Los permisos base del rol están bloqueados, puedes asignar/restringir permisos adicionales.
                </span>
              </div>
            ) : !user.roleId ? (
              <div className="text-xs text-gray-500 mt-2">
                Selecciona un rol para configurar permisos adicionales.
              </div>
            ) : null}
            <div className="flex justify-end">
              <Button type="submit" className="bg-primary text-white hover:bg-secondary">
                {id ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
