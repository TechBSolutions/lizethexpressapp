import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, SkipBack, Pencil, ShieldX, ShieldCheck } from "lucide-react";
import AddressCreateModal from "./AddressCreateModal"; // Ajusta la ruta si es diferente

export default function CustomerDetail() {
  const { cardCode } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [pickupAddresses, setPickupAddresses] = useState([]);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const resCustomer = await fetch(`/api/customers/${cardCode}`);
        if (!resCustomer.ok) {
          setError(`Cliente no encontrado (status ${resCustomer.status})`);
          setCustomer(null);
          setPickupAddresses([]);
          setShippingAddresses([]);
          setLoading(false);
          return;
        }
        const dataCustomer = await resCustomer.json();
        setCustomer(dataCustomer);

        const resPickup = await fetch(`/api/addresses?cardCode=${cardCode}&TypeAddress=1`);
        setPickupAddresses(await resPickup.json());

        const resShipping = await fetch(`/api/addresses?cardCode=${cardCode}&TypeAddress=2`);
        setShippingAddresses(await resShipping.json());
      } catch (err) {
        setError("Error cargando datos del cliente");
        setCustomer(null);
        setPickupAddresses([]);
        setShippingAddresses([]);
      }
      setLoading(false);
    };
    fetchAll();
  }, [cardCode]);

  const handleAddressCreated = () => {
    setTimeout(() => window.location.reload(), 400);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Cargando...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!customer) {
    return <div className="p-8 text-center text-red-500">Cliente no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2471a3] to-[#34495e] p-6">
      <header className="flex justify-between items-center mb-8">
        <Button onClick={() => navigate("/customers")} className="bg-primary text-white hover:bg-secondary">
          <SkipBack className="w-4 h-4 mr-2" />
        </Button>
        <h1 className="text-3xl font-bold text-white">Detalle del Cliente</h1>
        <span />
      </header>

      {/* BLOQUE: INFORMACIÓN GENERAL */}
      <Card className="mb-8 p-6">
        <div className="flex flex-wrap justify-end gap-2 mb-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/customer/edit/${customer.cardCode}`)}
            title="Editar Cliente"
          >
            <Pencil className="w-4 h-4 mr-1" /> Editar Cliente
          </Button>
          <Button
            size="sm"
            variant={customer.Status === "Activo" ? "destructive" : "secondary"}
            onClick={async () => {
              const action = customer.Status === "Activo" ? "disable" : "enable";
              const msg = customer.Status === "Activo"
                ? "¿Estás seguro que deseas deshabilitar este cliente?"
                : "¿Estás seguro que deseas habilitar este cliente?";
              if (window.confirm(msg)) {
                await fetch(`/api/customers/${customer.cardCode}/${action}`, { method: "PATCH" });
                window.location.reload();
              }
            }}
            title={customer.Status === "Activo" ? "Deshabilitar" : "Habilitar"}
          >
            {customer.Status === "Activo"
              ? <><ShieldX className="w-4 h-4 mr-1" /> Deshabilitar</>
              : <><ShieldCheck className="w-4 h-4 mr-1" /> Habilitar</>
            }
          </Button>
        </div>
        <h2 className="text-lg font-bold mb-4 text-primary">Información General</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><b>Código:</b> {customer.cardCode}</div>
          <div><b>Nombre:</b> {customer.CardName}</div>
          <div><b>NIT:</b> {customer.NIT || "-"}</div>
          <div><b>Tipo:</b> {customer.CardType}</div>
          <div><b>Estatus:</b> {customer.Status}</div>
          <div><b>Contacto:</b> {customer.CntctPrsn}</div>
          <div><b>Email:</b> {customer.E_mail}</div>
          <div><b>Teléfono:</b> {customer.Phone}</div>
          <div><b>Usuario Web:</b> {customer.UserWeb}</div>
          <div><b>Descuento:</b> {customer.Discount}%</div>
          <div><b>Línea de crédito:</b> {customer.CreditLin}</div>
          <div><b>Saldo:</b> {customer.Balance}</div>
          <div><b>Ruta:</b> {customer.Route}</div>
          <div><b>Fecha creación:</b> {customer.Create_date?.substring(0,10)}</div>
          <div><b>País:</b> {customer.Country}</div>
          <div><b>Estado:</b> {customer.State}</div>
          <div><b>Ciudad:</b> {customer.City}</div>
          <div><b>Código Postal:</b> {customer.ZipCode}</div>
          <div><b>Dirección principal:</b> {customer.Address}</div>
        </div>
        <div className="flex justify-end mt-6">
          <Button
            onClick={() => setShowAddressModal(true)}
            size="sm"
            className="bg-primary text-white hover:bg-secondary shadow-sm px-3 py-1 text-sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Nueva Dirección
          </Button>
        </div>
      </Card>

      {/* BLOQUE: DIRECCIONES DE RECOLECCIÓN */}
      <Card className="mb-8 p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-primary">Direcciones de Recolección</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pickupAddresses.length === 0 ? (
            <div className="text-gray-500 col-span-2">No hay direcciones de recolección registradas.</div>
          ) : (
            pickupAddresses.map(addr => (
              <div key={addr.idAddress} className="border rounded p-3 bg-gray-50">
                <b>{addr.address1}</b><br />
                {addr.city}, {addr.state}, {addr.country}, CP: {addr.zipCode}
                <div className="text-xs mt-1 text-gray-600">{addr.cntctPerson} - {addr.phone}</div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant={addr.status === "Activo" ? "destructive" : "secondary"}
                    onClick={async () => {
                      const action = addr.status === "Activo" ? "disable" : "enable";
                      const msg = addr.status === "Activo"
                        ? "¿Deshabilitar esta dirección?"
                        : "¿Habilitar esta dirección?";
                      if (window.confirm(msg)) {
                        await fetch(`/api/addresses/${addr.idAddress}/${action}`, { method: "PATCH" });
                        window.location.reload();
                      }
                    }}
                  >
                    {addr.status === "Activo" ? "Deshabilitar" : "Habilitar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/addresses/edit/${addr.idAddress}`)}
                  >
                    Editar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* BLOQUE: DIRECCIONES DE ENVÍO */}
      <Card className="mb-8 p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-primary">Direcciones de Envío</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shippingAddresses.length === 0 ? (
            <div className="text-gray-500 col-span-2">No hay direcciones de envío registradas.</div>
          ) : (
            shippingAddresses.map(addr => (
              <div key={addr.idAddress} className="border rounded p-3 bg-gray-50">
                <b>{addr.address1}</b><br />
                {addr.city}, {addr.state}, {addr.country}, CP: {addr.zipCode}
                <div className="text-xs mt-1 text-gray-600">{addr.cntctPerson} - {addr.phone}</div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant={addr.status === "Activo" ? "destructive" : "secondary"}
                    onClick={async () => {
                      const action = addr.status === "Activo" ? "disable" : "enable";
                      const msg = addr.status === "Activo"
                        ? "¿Deshabilitar esta dirección?"
                        : "¿Habilitar esta dirección?";
                      if (window.confirm(msg)) {
                        await fetch(`/api/addresses/${addr.idAddress}/${action}`, { method: "PATCH" });
                        window.location.reload();
                      }
                    }}
                  >
                    {addr.status === "Activo" ? "Deshabilitar" : "Habilitar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/addresses/edit/${addr.idAddress}`)}
                  >
                    Editar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Modal para crear dirección */}
      <AddressCreateModal
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        customer={customer}
        onSuccess={handleAddressCreated}
      />
    </div>
  );
}
