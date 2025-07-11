// src/pages/CustomerList.jsx

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, SkipBack } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "../api"; // <--- Importa tu utilitario

export default function CustomerList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    fetchApi("/customers")
      .then(res => res.json())
      .then(data => {
        // Asegura que sea array, sino deja vacío (evita errores de .map)
        setCustomers(Array.isArray(data) ? data : []);
      });
  }, []);

  useEffect(() => {
    setFilteredCustomers(
      customers.filter((c) =>
        c.CardName.toLowerCase().includes(search.toLowerCase()) ||
        c.cardCode.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, customers]);

  const handleToggleStatus = async (cardCode, currentStatus) => {
    const action = currentStatus === "Activo" ? "disable" : "enable";
    const msg = currentStatus === "Activo"
      ? "¿Estás seguro que deseas deshabilitar este cliente?"
      : "¿Estás seguro que deseas habilitar este cliente?";
    if (window.confirm(msg)) {
      await fetchApi(`/customers/${cardCode}/${action}`, { method: "PATCH" });
      window.location.reload();
    }
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2471a3] to-[#34495e] p-6">
    <header className="flex justify-between items-center mb-6">
    <Button onClick={() => navigate("/home")} className= "bg-primary text-white hover:bg-secondary" >
        <SkipBack className="w-4 h-4 mr-2" />
        </Button>
      <h1 className="text-3xl font-bold text-[White]">Detalle de Clientes</h1>
        <Button onClick={() => navigate("/customersnew")} className="bg-primary text-white">
          Nuevo Cliente
        </Button>
      </header>

      <div className="mb-4 flex justify-end">
        <input
          className="border px-3 py-1 rounded w-full max-w-xs"
          placeholder="Buscar por código o nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="min-w-full table-auto border border-gray-300 text-sm bg-white rounded-xl shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Código</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Teléfono</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Ciudad</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">País</th>
            <th className="px-4 py-2">Estatus</th>
            <th className="px-4 py-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-6 text-center text-gray-500">
                No se encontraron clientes.
              </td>
            </tr>
          ) : (
            filteredCustomers.map((c) => (
              <tr key={c.cardCode} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-secondary px-2 py-1 rounded text-white"
                    onClick={() => navigate(`/customer/${c.cardCode}`)}
                  >
                    {c.cardCode}
                  </Button>
                </td>
                <td className="px-4 py-2">{c.CardName}</td>
                <td className="px-4 py-2">{c.Phone}</td>
                <td className="px-4 py-2">{c.E_mail}</td>
                <td className="px-4 py-2">{c.City}</td>
                <td className="px-4 py-2">{c.State}</td>
                <td className="px-4 py-2">{c.Country}</td>
                <td className="px-4 py-2">{c.Status}</td>
                <td className="px-4 py-2">
                  <Button
                    size="sm"
                    variant={c.Status === "Activo" ? "destructive" : "secondary"}
                    onClick={() => handleToggleStatus(c.cardCode, c.Status)}
                  >
                    {c.Status === "Activo" ? "Deshabilitar" : "Habilitar"}
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
