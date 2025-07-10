import React from "react";
import { useNavigate } from "react-router-dom";
import { Package, Layers, Warehouse, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InventoryMainPage() {
  const navigate = useNavigate();

  const options = [
    {
      title: "Inventario de Paquetes de Clientes",
      description: "Gestione, busque y controle todos los paquetes bajo custodia de la empresa.",
      icon: <Package className="w-10 h-10 text-blue-700 mb-3" />,
      route: "/inventory/packages"
    },
    {
      title: "Inventario de Productos Internos",
      description: "Administre los materiales y productos internos (cajas, sobres, etc).",
      icon: <Layers className="w-10 h-10 text-green-700 mb-3" />,
      route: "/inventory/items"
    },
    {
      title: "Configuración de Almacenes",
      description: "Configure y visualice todos los almacenes: locales, tránsito o internacionales.",
      icon: <Warehouse className="w-10 h-10 text-yellow-700 mb-3" />,
      route: "/inventory/warehouses"
    },
{
  title: "Administración de Productos",
  description: "Cree y edite productos (ítems) que utiliza la empresa.",
  icon: <Layers className="w-10 h-10 text-purple-700 mb-3" />,
  route: "/product-admin"
}

  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2471a3] to-[#34495e] flex flex-col p-8">
      <header className="flex justify-between items-center mb-8">
        <Button onClick={() => navigate("/home")} className="bg-primary text-white hover:bg-secondary">
          <SkipBack className="w-4 h-4 mr-2" />
        </Button>
        <h1 className="text-3xl font-bold text-white">Gestión de Inventarios</h1>
        <span /> {/* Espacio para mantener el header centrado */}
      </header>
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {options.map(opt => (
              <div
                key={opt.title}
                className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center cursor-pointer hover:shadow-2xl transition"
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
