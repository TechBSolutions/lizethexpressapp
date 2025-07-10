import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AddressCreateModal({ open, onClose, customer, onSuccess }) {
  const [form, setForm] = useState({
    typeAddress: "PICKUP",
    cntctPerson: "",
    phone: "",
    email: "",
    Country: "",
    State: "",
    City: "",
    zipCode: "",
    street: "",
    address1: "",
    address2: "",
    reference: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Listar países
  useEffect(() => {
    if (open) {
      fetch("/api/geodb/countries")
        .then(res => res.json())
        .then(data => setCountries(data));
    }
  }, [open]);

  // Listar estados/departamentos
  useEffect(() => {
    if (form.Country) {
      fetch(`/api/geodb/regions/${form.Country}`)
        .then(res => res.json())
        .then(data => setStates(data));
      setForm(f => ({ ...f, State: "", City: "" }));
      setCities([]);
    }
  }, [form.Country]);

  // Listar ciudades
  useEffect(() => {
    if (form.Country && form.State) {
      fetch(`/api/geodb/cities/${form.Country}/${form.State}`)
        .then(res => res.json())
        .then(data => setCities(data));
      setForm(f => ({ ...f, City: "" }));
    }
  }, [form.State, form.Country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
        console.log("Body enviado al backend:", {
            ...form,
            cardCode: customer.cardCode,
          });
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cardCode: customer.cardCode,
        }),
      });
      if (!res.ok) throw new Error("No se pudo crear la dirección");
      setForm({
        typeAddress: "PICKUP",
        cntctPerson: "",
        phone: "",
        email: "",
        Country: "",
        State: "",
        City: "",
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[92vh] flex flex-col" style={{ minWidth: 0 }}>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <button type="button" className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-2xl" onClick={onClose} title="Cerrar">
          </button>
          <h2 className="text-xl font-bold text-primary mb-2 text-center">
            Nueva Dirección para {customer.CardName}
          </h2>
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
          {/* PAÍS */}
          <div>
            <label className="block text-sm font-medium">País</label>
            <select name="Country" value={form.Country} onChange={handleChange} className="w-full border px-2 py-1 rounded" required>
              <option value="">Selecciona un país</option>
              {countries.map((c, idx) => (
                <option key={(c.code || c.name) + '-' + idx} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
          {/* ESTADO/DEPTO */}
          <div>
            <label className="block text-sm font-medium">Estado/Depto</label>
            <select name="State" value={form.State} onChange={handleChange} className="w-full border px-2 py-1 rounded" required disabled={!states.length}>
              <option value="">Selecciona un estado/departamento</option>
              {states.map((s, idx) => (
                <option key={(s.code || s.name) + '-' + idx} value={s.code || s.name}>{s.name}</option>
              ))}
            </select>
          </div>
          {/* CIUDAD */}
          <div>
            <label className="block text-sm font-medium">Ciudad</label>
            <select name="City" value={form.City} onChange={handleChange} className="w-full border px-2 py-1 rounded" required disabled={!cities.length}>
              <option value="">Selecciona una ciudad</option>
              {cities.map((city, idx) => (
                <option key={(city.id || city.name) + '-' + idx} value={city.name}>{city.name}</option>
              ))}
            </select>
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
      </div>
    </div>
  );
}
