import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {Plus, SkipBack} from "lucide-react";
import ProductCreateModal from "./ProductCreateModal"; // ← AJUSTA ESTA RUTA SI ES NECESARIO
import { useNavigate } from "react-router-dom";

export default function ProductAdminPage() {
  const navigate =useNavigate();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then(setProducts);
  }, [showModal]); // recarga cuando se cierra el modal de creación

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2471a3] to-[#34495e] p-6">
      <header className="flex justify-between items-center mb-6">
      <Button onClick={() => navigate("/inventory")} className= "bg-primary text-white hover:bg-secondary" >
        <SkipBack className="w-4 h-4 mr-2" />
        </Button>
        <h1 className="text-2xl font-bold text-white">Administración de Productos</h1>
        <Button className="bg-primary text-white" onClick={() => setShowModal(true)}>
          + Nuevo Producto
        </Button>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 text-sm bg-white rounded-xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Unidad</th>
              <th className="px-4 py-2">Precio Costo</th>
              <th className="px-4 py-2">Precio Venta</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">¿Activo?</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500">
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.itemCode}>
                  <td className="border px-2 py-1">{product.itemCode}</td>
                  <td className="border px-2 py-1">{product.name}</td>
                  <td className="border px-2 py-1">{product.description}</td>
                  <td className="border px-2 py-1">{product.unit}</td>
                  <td className="border px-2 py-1">{product.costPrice}</td>
                  <td className="border px-2 py-1">{product.salePrice}</td>
                  <td className="border px-2 py-1">{product.stock}</td>
                  <td className="border px-2 py-1">
                    {product.isActive ? "Sí" : "No"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para crear producto */}
      {showModal && (
        <ProductCreateModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
