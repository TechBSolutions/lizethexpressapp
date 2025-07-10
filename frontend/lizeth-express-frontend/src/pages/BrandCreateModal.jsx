import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function BrandCreateModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("No se pudo crear la marca");
      setForm({ name: "" });
      onSuccess && onSuccess();
    } catch {
      setError("Error al crear la marca");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl w-full max-w-sm flex flex-col p-6 space-y-3"
      >
        <h2 className="text-lg font-bold text-primary mb-2">Nueva Marca</h2>
        <input
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full border px-2 py-1 rounded"
          placeholder="Nombre de la marca"
        />
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" onClick={onClose} variant="outline">Cancelar</Button>
          <Button type="submit" disabled={loading} className="bg-primary text-white">
            {loading ? "Guardando..." : "Crear"}
          </Button>
        </div>
      </form>
    </div>
  );
}
