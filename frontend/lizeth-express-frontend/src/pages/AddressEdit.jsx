import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/api";

export default function AddressEdit() {
  const { idAddress } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Cargar datos de la dirección
  useEffect(() => {
    fetchApi(`/addresses/${idAddress}`)
      .then(res => res.json())
      .then(data => {
        setForm(data);
        setLoading(false);
      });
  }, [idAddress]);

  // Listar países
  useEffect(() => {
    fetchApi("/geodb/countries")
      .then(res => res.json())
      .then(setCountries);
  }, []);

  // Listar estados cuando cambia el país
  useEffect(() => {
    if (form && form.country) {
      fetchApi(`/geodb/regions/${form.country}`)
        .then(res => res.json())
        .then(setStates);
    }
  }, [form?.country]);

  // Listar ciudades cuando cambia el estado o país
  useEffect(() => {
    if (form && form.country && form.state) {
      fetchApi(`/geodb/cities/${form.country}/${form.state}`)
        .then(res => res.json())
        .then(setCities);
    }
  }, [form?.state, form?.country]);

  if (loading || !form) return <div className="p-8 text-center">Cargando...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Cuando cambia el país, limpia estado y ciudad
    if (name === "country") {
      setForm(f => ({ ...f, state: "", city: "" }));
      setStates([]);
      setCities([]);
    }
    // Cuando cambia el estado, limpia ciudad
    if (name === "state") {
      setForm(f => ({ ...f, city: "" }));
      setCities([]);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { idAddress, ...dataToSend } = form; // No enviar idAddress al backend
    await fetchApi(`/addresses/${idAddress}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend)
    });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <div className="bg-white shadow rounded p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Editar Dirección</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs">Tipo</label>
            <select
              name="typeAddress"
              value={form.typeAddress || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              required
            >
              <option value="">Seleccione...</option>
              <option value="PICKUP">Recolección</option>
              <option value="DELIVERY">Envío</option>
            </select>
          </div>
          <div>
            <label className="block text-xs">Persona Contacto</label>
            <input
              name="cntctPerson"
              value={form.cntctPerson || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-xs">Teléfono</label>
            <input
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              type="tel"
            />
          </div>
          <div>
            <label className="block text-xs">País</label>
            <select
              name="country"
              value={form.country || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              required
            >
              <option value="">Seleccione...</option>
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs">Estado</label>
            <select
              name="state"
              value={form.state || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              required
              disabled={!form.country}
            >
              <option value="">Seleccione...</option>
              {states.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs">Ciudad</label>
            <select
              name="city"
              value={form.city || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              required
              disabled={!form.state}
            >
              <option value="">Seleccione...</option>
              {cities.map(ci => (
                <option key={ci.id} value={ci.name}>{ci.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs">Código Postal</label>
            <input
              name="zipCode"
              value={form.zipCode || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-xs">Dirección (Calle)</label>
            <input
              name="street"
              value={form.street || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-xs">Dirección 1</label>
            <input
              name="address1"
              value={form.address1 || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-xs">Dirección 2</label>
            <input
              name="address2"
              value={form.address2 || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-xs">Referencia</label>
            <input
              name="reference"
              value={form.reference || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-xs">Latitud</label>
            <input
              name="latitude"
              value={form.latitude || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              type="text"
            />
          </div>
          <div>
            <label className="block text-xs">Longitud</label>
            <input
              name="longitude"
              value={form.longitude || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              type="text"
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
            <Button type="submit" className="bg-primary text-white">Guardar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
