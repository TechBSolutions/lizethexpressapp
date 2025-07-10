import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartLine, Boxes, Landmark, FileText, Settings, Truck, User } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";


export default function ERPMainPage() {
    const navigate = useNavigate();
  
    useEffect(() => {
      const isAuth = localStorage.getItem("auth");
      if (!isAuth) {
        navigate("/home", { replace: true });
      }
    }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2471a3] to-[#34495e]">
  <header className="w-full bg-gray-100 py-1 px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Lizeth Express Logo" className="w-20 h-20 object-contain" />
          <h1 className="text-3xl font-bold text-gray-800">Portal de Gestión</h1>
        </div>
        <div className="flex flex-col justify-end items-end h-full">
        <h1 className="font-bold text-gray-800">Bienvenido</h1>
        <h2 className="font-lightbold text-gray-800">Jose Nahum Munguia </h2>
        
        <Button variant="default" onClick={() => navigate("/", { replace: true })}>
          Cerrar Sesión
        </Button>
        </div>
      </header>

      <main className="p-6">

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
       <div
  onClick={() => navigate('/ventas')}
  className="bg-white shadow-md hover:shadow-xl p-6 rounded-xl text-center cursor-pointer transition-all duration-200 hover:-translate-y-1"
>
  <ChartLine className="mx-auto mb-4 w-10 h-10 text-[#003366]" />
  <h2 className="text-xl font-semibold">Ventas</h2>
  <p className="text-sm text-gray-600">Facturación, seguimiento de pedidos y reportes de venta.</p>
</div>

<div
  onClick={() => navigate('/inventory')}
  className="bg-white shadow-md hover:shadow-xl p-6 rounded-xl text-center cursor-pointer transition-all duration-200 hover:-translate-y-1"
>
  <Boxes className="mx-auto mb-4 w-10 h-10 text-[#003366]"/>
  <h2 className="text-xl font-semibold">Inventario</h2>
  <p className="text-sm text-gray-600">Control de lotes, entradas/salidas y stock disponible.</p>
</div>

<div
  onClick={() => navigate('/customers')}
  className="bg-white shadow-md hover:shadow-xl p-6 rounded-xl text-center cursor-pointer transition-all duration-200 hover:-translate-y-1"
>
  <User className="mx-auto mb-4 w-10 h-10 text-[#003366]"/>
  <h2 className="text-xl font-semibold">Clientes</h2>
  <p className="text-sm text-gray-600">Administración de cuentas de clientes y contactos.</p>
</div>


<div
  onClick={() => navigate('')}
  className="bg-white shadow-md hover:shadow-xl p-6 rounded-xl text-center cursor-pointer transition-all duration-200 hover:-translate-y-1"
>
<Landmark className="mx-auto mb-4 w-10 h-10 text-[#003366]"/>
 <h2 className="text-xl font-semibold">Contabilidad</h2>
<p className="text-sm text-gray-600">Registros contables, informes financieros y balances.</p>
 </div>     

 <div
  onClick={() => navigate('/logistics')}
  className="bg-white shadow-md hover:shadow-xl p-6 rounded-xl text-center cursor-pointer transition-all duration-200 hover:-translate-y-1"
>
         <Truck className="mx-auto mb-4 w-10 h-10 text-[#003366]" />
            <h2 className="text-xl font-semibold">Logistica</h2>
            <p className="text-sm text-gray-600">Gestión de rutas,Recolección, entregas y logística interna.</p>
         
</div>
<div
  onClick={() => navigate('/config')}
  className="bg-white shadow-md hover:shadow-xl p-6 rounded-xl text-center cursor-pointer transition-all duration-200 hover:-translate-y-1"
>        
            <Settings className="mx-auto mb-4 w-10 h-10 text-[#003366]" />
            <h2 className="text-xl font-semibold">Configuración</h2>
            <p className="text-sm text-gray-600">Parámetros del sistema, seguridad y gestión de usuarios.</p>
          </div>
      </motion.div>
      </main>
    </div>
  );
}
