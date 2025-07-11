import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkipBack, Save } from "lucide-react";
import { fetchApi } from "@/api";

export default function CustomerCreate() {
  const [form, setForm] = useState({
    CardName: "",
    CardType: "",
    Status: "Active",
    CntctPrsn: "",
    E_mail: "",
    Phone: "",
    UserWeb: "",
    PasswordWeb: "",
    Country: "",
    State: "",
    City: "",
    ZipCode: "",
    NIT:"",
    Address: "",
    Discount: 0,
    CreditLin: 0,
    Route: 0,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Datos geográficos
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const navigate = useNavigate();

  // Listar países
  useEffect(() => {
    fetchApi("/geodb/countries")
      .then(res => res.json())
      .then(data => {
        setCountries(data);
      });
  }, []);

  // Listar estados/departamentos
  useEffect(() => {
    if (form.Country) {
      fetchApi(`/geodb/regions/${form.Country}`)
        .then(res => res.json())
        .then(data => setStates(data));
      setForm(f => ({ ...f, State: "", City: "" }));
      setCities([]);
    }
  }, [form.Country]);

  // Listar ciudades
  useEffect(() => {
    if (form.Country && form.State) {
      fetchApi(`/geodb/cities/${form.Country}/${form.State}`)
        .then(res => res.json())
        .then(data => setCities(data));
      setForm(f => ({ ...f, City: "" }));
    }
  }, [form.State, form.Country]);

  // Actualiza campo del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Guardar cliente
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.CardName || !form.CntctPrsn || !form.E_mail) {
      setError("Nombre, Contacto y Email son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetchApi("/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("No se pudo crear el cliente");
      navigate("/customers");
    } catch (err) {
      setError("Error al registrar el cliente. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#93b7d1] to-[#003f77] p-8">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Button onClick={() => navigate("/customers")} className="bg-primary text-white hover:bg-secondary">
            <SkipBack className="w-4 h-4 mr-2" />
          </Button>
          <h2 className="text-2xl font-bold text-gray-800">Registrar Nuevo Cliente</h2>
          <span />
        </div>
        <form onSubmit={handleSubmit}>
          {/* --- Bloque 1: Información General --- */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-primary mb-2">Información General</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Cliente *</label>
                <input name="CardName" value={form.CardName} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Documento Identificación *</label>
                <input name="NIT" value={form.NIT} onChange={handleChange} className="w-80 border px-3 py-2 rounded" required />
              </div>
              <div >
                <label className="block text-sm font-medium text-gray-700">Tipo de Registro *</label>
                <select name="CardType" value={form.CardType} onChange={handleChange} className="w-40 border px-3 py-2 rounded" required>
                  <option value="">Seleccione...</option>
                  <option value="C">Agente</option>
                  <option value="S">Cliente</option>
                  <option value="L">Casillero</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estatus</label>
                <select name="Status" value={form.Status} onChange={handleChange} className="w-40 border px-3 py-2 rounded">
                  <option value="Active">Activo</option>
                  <option value="Inactive">Inactivo</option>
                </select>
              </div>
            </div>
          </div>
          {/* --- Bloque 2: Contacto --- */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-primary mb-2">Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Persona de Contacto *</label>
                <input name="CntctPrsn" value={form.CntctPrsn} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input name="E_mail" type="email" value={form.E_mail} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input name="Phone" value={form.Phone} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Usuario Web / Contraseña</label>
                <div className="flex gap-2">
                  <input name="UserWeb" value={form.UserWeb} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Usuario" />
                  <input name="PasswordWeb" type="password" value={form.PasswordWeb} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Contraseña" />
                </div>
              </div>
            </div>
          </div>
          {/* --- Bloque 3: Dirección --- */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-primary mb-2">Dirección</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">País *</label>
                <select name="Country" value={form.Country} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
                  <option value="">Seleccione...</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado/Depto *</label>
                <select name="State" value={form.State} onChange={handleChange} className="w-full border px-3 py-2 rounded" required disabled={!form.Country}>
                  <option value="">Seleccione...</option>
                  {states.map((s) => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ciudad *</label>
                <select name="City" value={form.City} onChange={handleChange} className="w-full border px-3 py-2 rounded" required disabled={!form.State}>
                  <option value="">Seleccione...</option>
                  {cities.map((ci) => (
                    <option key={ci.id} value={ci.name}>{ci.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Código Postal *</label>
                <input name="ZipCode" value={form.ZipCode} onChange={handleChange} className="w-full border px-3 py-2 rounded"  required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <input name="Address" value={form.Address} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
            </div>
          </div>
          {/* --- Bloque 4: Negocio --- */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-2">Negocio</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Descuento (%)</label>
                <input name="Discount" type="number" value={form.Discount} onChange={handleChange} className="w-full border px-3 py-2 rounded" min={0} max={100} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Línea de Crédito</label>
                <input name="CreditLin" type="number" value={form.CreditLin} onChange={handleChange} className="w-full border px-3 py-2 rounded" min={0} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ruta</label>
                <input name="Route" type="number" value={form.Route} onChange={handleChange} className="w-full border px-3 py-2 rounded" min={0} />
              </div>
            </div>
          </div>
          {error && <div className="text-red-500 mt-4">{error}</div>}
          <div className="flex justify-end mt-6">
            <Button type="submit" className="bg-primary text-white hover:bg-secondary flex items-center" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
