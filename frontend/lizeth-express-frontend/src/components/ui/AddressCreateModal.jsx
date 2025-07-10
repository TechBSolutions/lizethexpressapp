import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog"; // O usa el modal de tu librería
import { Button } from "@/components/ui/button";

export default function AddressCreateModal({ open, onClose, customer, onSuccess }) {
  const [form, setForm] = useState({
    typeAddress: "PICKUP",
    cntctPerson: "",
    phone: "",
    email: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    street: "",
    address1: "",
    address2: "",
    reference: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cardCode: customer.cardCode, // Asocia con el cliente actual
        }),
      });
      if (!res.ok) throw new Error("No se pudo crear la dirección");
      setForm({
        typeAddress: "PICKUP",
        cntctPerson: "",
        phone: "",
        email: "",
        country: "",
        state: "",
        city: "",
        zipCode: "",
        street: "",
        address1: "",
        address2: "",
        reference: "",
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError("Error al crear la dirección. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-6 max-w-lg bg-white rounded-xl shadow-lg space-y-4">
        <h2 className="text-xl font-bold text-primary mb-2">Nueva Dirección para {customer.CardName}</h2>
        <div>
          <label className="block text-sm font-medium">Tipo de dirección</label>
          <select name="typeAddress" value={form.typeAddress} onChange={handleChange} className="w-full border px-2 py-1 rounded">
            <option value="PICKUP">Recolección</option>
            <option value="DELIVERY">Envío</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Nombre de contacto</label>
          <input name="cntctPerson" value={form.cntctPerson} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Teléfono</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="w-full border px-2 py-1 rounded" type="email" />
        </div>
        <div>
          <label className="block text-sm font-medium">País</label>
          <input name="country" value={form.country} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Estado/Depto</label>
          <input name="state" value={form.state} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Ciudad</label>
          <input name="city" value={form.city} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Código Postal</label>
          <input name="zipCode" value={form.zipCode} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Calle, Colonia, Barrio, etc</label>
          <input name="street" value={form.street} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Dirección 1 (opcional)</label>
          <input name="address1" value={form.address1} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Dirección 2 (opcional)</label>
          <input name="address2" value={form.address2} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Referencia adicional (opcional)</label>
          <input name="reference" value={form.reference} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-end gap-2">
          <Button type="button" onClick={onClose} variant="outline">Cancelar</Button>
          <Button type="submit" disabled={loading} className="bg-primary text-white">
            {loading ? "Guardando..." : "Guardar Dirección"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
