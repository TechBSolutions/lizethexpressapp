// src/pages/LogisticsMainPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Warehouse, Truck, Users, MapPinned, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogisticsMainPage() {
  const navigate = useNavigate();

  const options = [
    {
      title: "Flota Vehicular",
      description: "Gestiona, crea y configura los vehículos disponibles para la flota logística.",
      icon: <Truck className="w-10 h-10 text-green-700 mb-3" />,
      route: "/logistics/fleet"
    },
    {
      title: "Motoristas",
      description: "Registra y administra los motoristas de la flota vehicular.",
      icon: <Users className="w-10 h-10 text-blue-700 mb-3" />,
      route: "/logistics/drivers"
    },
    {
      title: "Recolección",
      description: "Panel para motoristas, donde pueden ver y gestionar las recolecciones asignadas por ruta.",
      icon: <MapPinned className="w-10 h-10 text-indigo-700 mb-3" />,
      route: "/logistics/collections"
    },
    {
      title: "Rutas",
      description: "Crea, edita y configura las rutas de entrega y recolección.",
      icon: <Map className="w-10 h-10 text-red-700 mb-3" />,
      route: "/logistics/routes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2471a3] to-[#34495e] flex flex-col p-8">
      <header className="flex justify-between items-center mb-8">
        <Button onClick={() => navigate("/home")} className="bg-primary text-white hover:bg-secondary">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <h1 className="text-3xl font-bold text-white">Gestión Logística</h1>
        <span /> {/* Para centrar el header */}
      </header>
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {options.map(opt => (
              <div
                key={opt.title}
                className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center cursor-pointer hover:shadow-2xl transition hover:-translate-y-1"
                onClick={() => navigate(opt.route)}
              >
                {opt.icon}
                <h2 className="text-lg font-semibold text-[#003f77] mb-2 text-center">{opt.title}</h2>
                <p className="text-gray-600 text-center">{opt.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
