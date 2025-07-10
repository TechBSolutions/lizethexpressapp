import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import PermissionMatrix from "@/components/PermissionMatrix";

// ---- DEFINE AQUÍ LOS MÓDULOS Y PERMISOS ----
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

// ---- Crea permisos por defecto ----
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

// NUEVO: Función para marcar todo en true
function setAllPermissionsTrue(obj) {
  const newObj = {};
  for (const mod in obj) {
    newObj[mod] = {};
    for (const sub in obj[mod]) {
      newObj[mod][sub] = {};
      for (const perm in obj[mod][sub]) {
        newObj[mod][sub][perm] = true;
      }
    }
  }
  return newObj;
}

export default function RoleForm() {
  const { id } = useParams();
  const [role, setRole] = useState({
    name: "",
    description: "",
    permisos: buildDefaultPermissions(),
    isSuperadmin: false,
  });
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetch(`/api/roles/${id}`)
        .then(res => res.json())
        .then(data => {
          // Merge missing modules/submodules in case of schema changes
          const fullPerms = buildDefaultPermissions();
          Object.keys(data.permisos || {}).forEach(mod => {
            if (fullPerms[mod]) {
              Object.keys(data.permisos[mod]).forEach(sub => {
                fullPerms[mod][sub] = {
                  ...fullPerms[mod][sub],
                  ...(data.permisos[mod][sub] || {})
                };
              });
            }
          });
          setRole({
            name: data.name,
            description: data.description,
            permisos: fullPerms,
            isSuperadmin: data.isSuperadmin || false,
          });
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = e => setRole({ ...role, [e.target.name]: e.target.value });
  const handlePermisosChange = perms => setRole({ ...role, permisos: perms });

  // NUEVO: Handler para el check de Superadmin
  const handleSuperadminChange = e => {
    const checked = e.target.checked;
    setRole(prev => ({
      ...prev,
      isSuperadmin: checked,
      permisos: checked ? setAllPermissionsTrue(buildDefaultPermissions()) : buildDefaultPermissions()
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!role.name) {
      setError("El nombre del rol es obligatorio");
      return;
    }
    const method = id ? "PUT" : "POST";
    const url = id ? `/api/roles/${id}` : "/api/roles";
    // NUEVO: Si es Superadmin, envía el flag y todos los permisos en true
    const payload = {
      ...role,
      permisos: role.isSuperadmin ? setAllPermissionsTrue(buildDefaultPermissions()) : role.permisos,
      isSuperadmin: !!role.isSuperadmin
    };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      navigate("/config/roles");
    } else {
      setError("Error al guardar el rol");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2471a3] to-[#34495e] p-8">
      <header className="flex justify-between items-center mb-8">
        <Button onClick={() => navigate("/config/roles")} className="bg-primary text-white hover:bg-secondary">
          {"<"}
        </Button>
        <h1 className="text-3xl font-bold text-white">{id ? "Editar Rol" : "Nuevo Rol"}</h1>
        <span />
      </header>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-5xl mx-auto">
        {loading ? (
          <div className="text-gray-500">Cargando...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-600">{error}</div>}
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                value={role.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <input
                type="text"
                name="description"
                value={role.description}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* NUEVO: Checkbox para Superadmin */}
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="isSuperadmin"
                checked={role.isSuperadmin}
                onChange={handleSuperadminChange}
                className="mr-2"
              />
              <label htmlFor="isSuperadmin" className="text-lg font-bold text-red-600">
                Superadmin (Acceso TOTAL a todo el sistema)
              </label>
            </div>

            {/* Solo muestra la matriz de permisos si NO es superadmin */}
            {!role.isSuperadmin && (
              <div>
                <label className="block text-sm font-medium mb-1">Permisos</label>
                <PermissionMatrix
                  value={role.permisos}
                  onChange={handlePermisosChange}
                  modules={MODULES}
                  permissionTypes={PERMISSION_TYPES}
                />
                <span className="text-xs text-gray-400">Marca los permisos para cada submódulo.</span>
              </div>
            )}
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
