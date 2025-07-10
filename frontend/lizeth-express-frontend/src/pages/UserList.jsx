import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2471a3] to-[#34495e] p-8">
      <header className="flex justify-between items-center mb-8">
        <Button onClick={() => navigate("/config")} className="bg-primary text-white hover:bg-secondary">
          {"<"}
        </Button>
        <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
        <Button onClick={() => navigate("/config/users/new")} className="bg-primary text-white hover:bg-secondary">
          + Nuevo Usuario
        </Button>
      </header>
      <div className="bg-white rounded-xl shadow-lg p-6">
        {loading ? (
          <div className="text-gray-500">Cargando usuarios...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Usuario</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Rol</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t">
                  <td className="py-2 px-4">{user.username}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.role?.name}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <Button size="sm" onClick={() => navigate(`/config/users/${user.id}/edit`)}>Editar</Button>
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
