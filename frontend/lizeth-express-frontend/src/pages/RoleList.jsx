import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function RoleList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRoles = () => {
    setLoading(true);
    fetch("/api/roles")
      .then(res => res.json())
      .then(data => {
        setRoles(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este rol?")) return;
    await fetch(`/api/roles/${id}`, { method: "DELETE" });
    fetchRoles();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2471a3] to-[#34495e] p-8">
      <header className="flex justify-between items-center mb-8">
        <Button onClick={() => navigate("/config")} className="bg-primary text-white hover:bg-secondary">
          {"<"}
        </Button>
        <h1 className="text-3xl font-bold text-white">Gestión de Roles</h1>
        <Button onClick={() => navigate("/config/roles/new")} className="bg-primary text-white hover:bg-secondary">
          + Nuevo Rol
        </Button>
      </header>
      <div className="bg-white rounded-xl shadow-lg p-6">
        {loading ? (
          <div className="text-gray-500">Cargando roles...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-left">Descripción</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role.id} className="border-t">
                  <td className="py-2 px-4">{role.name}</td>
                  <td className="py-2 px-4">{role.description}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <Button size="sm" onClick={() => navigate(`/config/roles/${role.id}/edit`)}>Editar</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(role.id)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
