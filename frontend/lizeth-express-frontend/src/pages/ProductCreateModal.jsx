import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ProductCreateModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    unit: "",
    size: "",
    barcode: "",
    costPrice: "",
    salePrice: "",
    wholesalePrice: "",
    stock: 0,
    minStock: 0,
    location: "",
    isActive: true,
    imageUrl: "",
    itemType: "", // tipo de producto: INV, VTA, SER
    batchNumber: "",
    expirationDate: "",
    maxDiscount: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autogenCode, setAutogenCode] = useState(""); // Solo visualización opcional

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validación básica
    if (!form.itemType || !form.name || !form.description) {
      setError("Tipo de item, nombre y descripción son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
        }),
      });
      if (!res.ok) throw new Error("No se pudo crear el producto");
      const data = await res.json();
      setAutogenCode(data.itemCode || ""); // Solo para mostrar si quieres
      setForm({
        name: "",
        description: "",
        unit: "",
        size: "",
        barcode: "",
        costPrice: "",
        salePrice: "",
        wholesalePrice: "",
        stock: 0,
        minStock: 0,
        location: "",
        isActive: true,
        imageUrl: "",
        itemType: "",
        batchNumber: "",
        expirationDate: "",
        maxDiscount: "",
        notes: "",
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError("Error al crear el producto. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col p-6 space-y-3 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-xl font-bold text-primary mb-2">Nuevo Producto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* CÓDIGO AUTOGENERADO SOLO PARA VISUALIZAR */}
          <div>
            <label className="block text-xs font-semibold">Código (autogenerado)</label>
            <input value={autogenCode} readOnly disabled className="w-full border px-2 py-1 rounded bg-gray-100" placeholder="Se generará automáticamente" />
          </div>
          <div>
            <label className="block text-xs font-semibold">Tipo de Item *</label>
            <select
              name="itemType"
              value={form.itemType}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              required
            >
              <option value="">Seleccione...</option>
              <option value="INV">Producto de Inventario</option>
              <option value="VTA">Producto de Venta</option>
              <option value="SER">Servicio</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold">Nombre *</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold">Descripción *</label>
            <input name="description" value={form.description} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
          </div>
          <div>
            <label className="block text-xs">Unidad</label>
            <input name="unit" value={form.unit} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label className="block text-xs">Tamaño</label>
            <input name="size" value={form.size} onChange={handleChange} type="number" min="0" step="0.01" className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label className="block text-xs">Código de Barra</label>
            <input name="barcode" value={form.barcode} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label className="block text-xs">Precio Costo</label>
            <input name="costPrice" value={form.costPrice} onChange={handleChange} type="number" min="0" step="0.01" className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label className="block text-xs">Precio Venta</label>
            <input name="salePrice" value={form.salePrice} onChange={handleChange} type="number" min="0" step="0.01" className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label className="block text-xs">Precio Mayorista</label>
            <input name="wholesalePrice" value={form.wholesalePrice} onChange={handleChange} type="number" min="0" step="0.01" className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label className="block text-xs">Stock</label>
            <input name="stock" value={form.stock} onChange={handleChange} type="number" min="0" className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label className="block text-xs">Stock mínimo</label>
            <input name="minStock" value={form.minStock} onChange={handleChange} type="number" min="0" className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label className="block text-xs">Ubicación</label>
            <input name="location" value={form.location} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label className="block text-xs">Imagen (URL)</label>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label className="block text-xs">Notas</label>
            <input name="notes" value={form.notes} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label className="block text-xs">Lote</label>
            <input name="batchNumber" value={form.batchNumber} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label className="block text-xs">Fecha Vencimiento</label>
            <input name="expirationDate" value={form.expirationDate} onChange={handleChange} type="date" className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label className="block text-xs">¿Activo?</label>
            <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} className="ml-2" />
          </div>
          <div>
            <label className="block text-xs">Descuento Máx. (%)</label>
            <input name="maxDiscount" value={form.maxDiscount} onChange={handleChange} type="number" min="0" max="100" step="0.01" className="w-full border px-2 py-1 rounded" />
          </div>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" onClick={onClose} variant="outline">Cancelar</Button>
          <Button type="submit" disabled={loading} className="bg-primary text-white">
            {loading ? "Guardando..." : "Crear Producto"}
          </Button>
        </div>
      </form>
    </div>
  );
}
