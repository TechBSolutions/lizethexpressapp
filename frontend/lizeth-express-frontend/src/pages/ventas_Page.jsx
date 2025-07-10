import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkipBack,Plus, FileText, DollarSign, ShoppingCart, ClipboardList, BarChart2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function VentasPage() {
const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2471a3] to-[#34495e] p-6">
      <header className="flex justify-between items-center mb-6">
      <Button onClick={() => navigate("/home")} className= "bg-primary text-white hover:bg-secondary" >
          <SkipBack className="w-4 h-4 mr-2" />
          </Button>
        <h1 className="text-3xl font-bold text-[White]">Gestión de Ventas</h1>
        <Button onClick={() => navigate("/pedido")}className="bg-primary text-white hover:bg-secondary">
          <Plus className="w-4 h-4 mr-2" /> Nuevo Pedido
        </Button>
      </header>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
  onClick={() => navigate('/listpedidos')}
  className="bg-white shadow-md hover:shadow-xl p-6 rounded-xl text-center cursor-pointer transition-all duration-200 hover:-translate-y-1"
>
  <ShoppingCart className="mx-auto mb-4 w-10 h-10 text-[#003366]"/>
  <h2 className="text-xl font-semibold">Pedidos Recientes</h2>
  <p className="text-sm text-gray-600">Consulta los pedidos generados en la última semana.</p>
</div>
<div
  onClick={() => navigate('')}
  className="bg-white shadow-md hover:shadow-xl p-6 rounded-xl text-center cursor-pointer transition-all duration-200 hover:-translate-y-1"
>
  <DollarSign className="mx-auto mb-4 w-10 h-10 text-[#003366]"/>
  <h2 className="text-xl font-semibold">Facturación</h2>
  <p className="text-sm text-gray-600">Emisión y seguimiento de facturas de venta.</p>
</div>


        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <BarChart2 className="w-6 h-6 text-primary mb-2" />
            <h2 className="text-lg font-semibold text-darkText">Reportes</h2>
            <p className="text-sm text-gray-600">Visualiza indicadores clave de ventas.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <ClipboardList className="w-6 h-6 text-primary mb-2" />
            <h2 className="text-lg font-semibold text-darkText">Historial de Pedidos</h2>
            <p className="text-sm text-gray-600">Consulta completa del historial de ventas por cliente o producto.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <Users className="w-6 h-6 text-primary mb-2" />
            <h2 className="text-lg font-semibold text-darkText">Clientes Frecuentes</h2>
            <p className="text-sm text-gray-600">Listado de los clientes con mayor volumen de compra.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <FileText className="w-6 h-6 text-primary mb-2" />
            <h2 className="text-lg font-semibold text-darkText">Cotizaciones</h2>
            <p className="text-sm text-gray-600">Genera y administra cotizaciones para clientes potenciales.</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-10">
        <h3 className="text-xl text-white font-semibold text-primary mb-4">Resumen General de Ventas</h3>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-600 text-sm">
            En esta sección se consolidan todos los datos de ventas, incluyendo: volumen total facturado, productos más vendidos, clientes principales, y comparativos mensuales de desempeño.
          </p>
        </div>
      </div>
    </div>
  );
}
