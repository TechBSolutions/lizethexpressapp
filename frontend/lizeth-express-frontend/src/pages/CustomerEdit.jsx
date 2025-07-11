import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {fetchApi} from "@/api";

export default function CustomerEdit() {
  const { cardCode } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApi(`/api/customers/${cardCode}`)
      .then(res => res.json())
      .then(data => { setForm(data); setLoading(false); })
      .catch(() => { setError("Error al cargar datos"); setLoading(false); });
  }, [cardCode]);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const handleChange = e => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" ? Number(value) : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await fetchApi(`/api/customers/${cardCode}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    navigate(`/customer/${cardCode}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <div className="bg-white shadow rounded p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Editar Cliente</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs">Código Cliente</label>
            <input
              name="cardCode"
              value={form.cardCode || ""}
              readOnly
              disabled
              className="w-full border px-2 py-1 rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-xs">Nombre</label>
            <input
              name="CardName"
              value={form.CardName || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-xs">NIT</label>
            <input
              name="NIT"
              value={form.NIT || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-xs">Tipo</label>
            <input
              name="CardType"
              value={form.CardType || ""}
              readOnly
              disabled
              className="w-full border px-2 py-1 rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-xs">Estatus</label>
              <input
              name="Status"
              value={form.Status || "Activo"}
              readOnly
              disabled
              className="w-full border px-2 py-1 rounded bg-gray-100"/>
          </div>
          <div>
            <label className="block text-xs">Contacto</label>
            <input
              name="CntctPrsn"
              value={form.CntctPrsn || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-xs">Email</label>
            <input
              name="E_mail"
              value={form.E_mail || ""}
              onChange={handleChange}
              type="email"
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-xs">Teléfono</label>
            <input
              name="Phone"
              value={form.Phone || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              type="tel"
            />
          </div>
          <div>
            <label className="block text-xs">Usuario Web</label>
            <input
              name="UserWeb"
              value={form.UserWeb || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-xs">Contraseña Web</label>
            <input
              name="PasswordWeb"
              value={form.PasswordWeb || ""}
              onChange={handleChange}
              type="password"
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-xs">Descuento (%)</label>
            <input
              name="Discount"
              value={form.Discount || 0}
              onChange={handleChange}
              type="number"
              className="w-full border px-2 py-1 rounded"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-xs">Línea de crédito</label>
            <input
              name="CreditLin"
              value={form.CreditLin || 0}
              onChange={handleChange}
              type="number"
              className="w-full border px-2 py-1 rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs">Saldo</label>
            <input
              name="Balance"
              value={form.Balance || 0}
              onChange={handleChange}
              type="number"
              className="w-full border px-2 py-1 rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs">Ruta</label>
            <input
              name="Route"
              value={form.Route || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-xs">País</label>
            <input
              name="Country"
              value={form.Country || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-xs">Estado</label>
            <input
              name="State"
              value={form.State || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-xs">Ciudad</label>
            <input
              name="City"
              value={form.City || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-xs">Código Postal</label>
            <input
              name="ZipCode"
              value={form.ZipCode || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs">Dirección Principal</label>
            <input
              name="Address"
              value={form.Address || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
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
