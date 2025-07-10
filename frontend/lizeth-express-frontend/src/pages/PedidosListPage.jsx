import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, SkipBack, DollarSign } from "lucide-react";

export default function PedidosListPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/listpedidos")
      .then((res) => res.json())
      .then((data) => {
        setPedidos(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setPedidos([]);
      });
  }, []);
  

  // Filtro búsqueda simple
  const filteredPedidos = pedidos.filter((p) => {
    return (
      (p.NombreCliente && p.NombreCliente.toLowerCase().includes(search.toLowerCase())) ||
      (p.NumeroDocumento && String(p.NumeroDocumento).toLowerCase().includes(search.toLowerCase())) ||
      (p.NumeroPedido && String(p.NumeroPedido).toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2471a3] to-[#34495e] p-6 text-center">
      <header className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate("/ventas")} className="bg-primary text-white hover:bg-secondary">
          <SkipBack className="w-4 h-4 mr-2" /> Regresar
        </Button>
        <h1 className="text-3xl font-bold text-white">Pedidos Abiertos</h1>
        <span />
      </header>
      <Card className="p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 text-gray-800">Buscar Pedidos</h1>
            <p className="text-gray-600 text-sm">Filtra por cliente, número de documento o número de pedido.</p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Buscar..."
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button>
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="py-8 text-center text-gray-500">Cargando pedidos...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow text-sm">
              <thead className="bg-gray-100">
              <tr>
      <th className="px-2 py-1"># Documento</th>
      <th className="px-2 py-1"># Pedido</th>
      <th className="px-2 py-1">Código Cliente</th>
      <th className="px-2 py-1">Nombre Cliente</th>
      <th className="px-2 py-1">País Entrega</th>
      <th className="px-2 py-1">Items</th>
      <th className="px-2 py-1">Fecha Pedido</th>
      <th className="px-2 py-1">Fecha Recolección</th>
      <th className="px-2 py-1">Total Pedido</th>
      <th className="px-2 py-1">Facturar</th>
    </tr>
              </thead>
              <tbody>
                {filteredPedidos.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-6 text-center text-gray-500">
                      No hay pedidos abiertos.
                    </td>
                  </tr>
                ) : (
                  filteredPedidos.map((p) => (
                    <tr key={p.NumeroPedido} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2">
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-secondary px-2 py-1 rounded text-white"
                          onClick={() => navigate(`/pedido/${p.NumeroDocumento}`)}
                        >
                          {p.NumeroDocumento}
                        </Button>
                      </td>
                      <td className="px-4 py-2">{p.NumeroPedido}</td>
                      <td className="px-4 py-2">{p.CodigoCliente}</td>
                      <td className="px-4 py-2">{p.NombreCliente}</td>
                      <td className="px-4 py-2">{p.PaisEntrega}</td>
                      <td className="px-4 py-2 text-center">{p.CantidadItems}</td>
                      <td className="px-4 py-2">{p.FechaPedido?.substring(0,10)}</td>
                      <td className="px-4 py-2">{p.FechaRecoleccion?.substring(0,10)}</td>
                      <td className="px-4 py-2 font-semibold text-green-700">{Number(p.TotalPedido).toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => alert("Pronto podrás facturar este pedido")}
                        >
                          <DollarSign className="w-4 h-4" /> Facturar
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
