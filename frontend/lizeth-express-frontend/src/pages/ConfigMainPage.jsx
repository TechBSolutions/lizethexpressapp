// src/pages/ConfigMainPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Users, Shield, List, ClipboardList, Link2, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfigMainPage() {
  const navigate = useNavigate();

  const options = [
    {
      title: "Parámetros Generales",
      description: "Personaliza datos de empresa, logo, impuestos, moneda, etc.",
      icon: <Settings className="w-10 h-10 text-blue-700 mb-3" />,
      route: "/config/parameters"
    },
    {
      title: "Usuarios",
      description: "Gestiona cuentas, claves y accesos de usuarios.",
      icon: <Users className="w-10 h-10 text-green-700 mb-3" />,
      route: "/config/users"
    },
    {
      title: "Perfiles y Roles",
      description: "Define permisos, perfiles de acceso y reglas de seguridad.",
      icon: <Shield className="w-10 h-10 text-yellow-700 mb-3" />,
      route: "/config/roles"
    },
    {
      title: "Catálogos y Listas",
      description: "Administra tipos de documentos, listas y clasificaciones.",
      icon: <List className="w-10 h-10 text-purple-700 mb-3" />,
      route: "/config/catalogs"
    },
    {
      title: "Auditoría",
      description: "Consulta el historial de cambios y bitácora del sistema.",
      icon: <ClipboardList className="w-10 h-10 text-orange-700 mb-3" />,
      route: "/config/audit"
    },
    {
      title: "Integraciones",
      description: "Configura APIs, correo y conexiones externas.",
      icon: <Link2 className="w-10 h-10 text-pink-700 mb-3" />,
      route: "/config/integrations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2471a3] to-[#34495e] flex flex-col p-8">
      <header className="flex justify-between items-center mb-8">
        <Button onClick={() => navigate("/home")} className="bg-primary text-white hover:bg-secondary">
          <SkipBack className="w-4 h-4 mr-2" />
        </Button>
        <h1 className="text-3xl font-bold text-white">Configuración del Sistema</h1>
        <span /> {/* Para centrar el header */}
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
