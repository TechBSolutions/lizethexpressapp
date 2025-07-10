
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, XCircle, LucideSkipBack } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddressCreateModal from "./AddressCreateModal";

function addBusinessDays(date, days) {
  let count = 0;
  let result = new Date(date);
  while (count < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      count++;
    }
  }
  return result;
}

export default function CreatePickupOrder() {
  const navigate = useNavigate();

  // Cliente, direcciones y modal
  const [customerCode, setCustomerCode] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [pickupAddresses, setPickupAddresses] = useState([]);
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Fechas y documento
  const creationDate = new Date().toISOString().split("T")[0];
  const [pickupDate, setPickupDate] = useState(addBusinessDays(new Date(), 3));
  const [docNumber, setDocNumber] = useState("AUTO"); // Mostrará el correlativo después de guardar

  const [comment, setComment] = useState("");
  const [discount, setDiscount] = useState(0);

  // Artículos con autocompletar
  const [items, setItems] = useState([
    {
      itemCode: "",
      description: "",
      unit: "Unidad",
      quantity: 1,
      salePrice: 0,
      deliveryAddressId: "",
    },
  ]);
  const [articleSuggestions, setArticleSuggestions] = useState([]);
  const [activeArticleIdx, setActiveArticleIdx] = useState(null);
  const lastRowRef = useRef(null);

  // Cargar direcciones cuando selecciona cliente
  useEffect(() => {
    if (selectedCustomer && selectedCustomer.cardCode) {
      fetch(`/api/addresses?cardCode=${selectedCustomer.cardCode}&TypeAddress=1`)
        .then(res => res.json())
        .then(data => setPickupAddresses(data));
      fetch(`/api/addresses?cardCode=${selectedCustomer.cardCode}&TypeAddress=2`)
        .then(res => res.json())
        .then(data => setDeliveryAddresses(data));
    } else {
      setPickupAddresses([]);
      setDeliveryAddresses([]);
      setSelectedPickup("");
      setSelectedDelivery("");
    }
  }, [selectedCustomer]);

  // Refrescar direcciones tras agregar nueva
  const handleAddressCreated = () => {
    setShowAddressModal(false);
    if (selectedCustomer && selectedCustomer.cardCode) {
      fetch(`/api/addresses?cardCode=${selectedCustomer.cardCode}&TypeAddress=1`)
        .then(res => res.json())
        .then(data => setPickupAddresses(data));
      fetch(`/api/addresses?cardCode=${selectedCustomer.cardCode}&TypeAddress=2`)
        .then(res => res.json())
        .then(data => setDeliveryAddresses(data));
    }
  };

  // Buscar clientes
  const handleSearchCustomer = async () => {
    setShowCustomerModal(true);
    setCustomers([]);
    try {
      const res = await fetch(`/api/customers?search=${customerSearch}`);
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      setCustomers([]);
    }
  };

  // Artículos - agregar línea nueva con TAB
  const addItem = () => {
    setItems([
      ...items,
      {
        itemCode: "",
        description: "",
        unit: "Unidad",
        quantity: 1,
        salePrice: 0,
        deliveryAddressId: selectedDelivery,
      },
    ]);
    setTimeout(() => {
      if (lastRowRef.current) lastRowRef.current.focus();
    }, 100);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    // Solo permiten editar unidad, cantidad, dirección envío
    if (["unit", "quantity", "deliveryAddressId"].includes(field)) {
      newItems[index][field] = field === "quantity" ? parseFloat(value || 0) : value;
      setItems(newItems);
      return;
    }
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Autocompletar artículo
  const handleArticleSearch = async (value, idx) => {
    setActiveArticleIdx(idx);
    if (!value) {
      setArticleSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/items?search=${encodeURIComponent(value)}`);
      const data = await res.json();
      setArticleSuggestions(data);
    } catch {
      setArticleSuggestions([]);
    }
  };

  // CORREGIDO: cuando seleccionas artículo, asigna SIEMPRE itemCode (del API)
  const selectArticle = (article, idx) => {
    const newItems = [...items];
    newItems[idx] = {
      ...newItems[idx],
      itemCode: article.itemCode, // <- Aquí el código correcto, jamás debe quedar undefined
      description: article.description,
      unit: article.unit || "Unidad",
      salePrice: article.salePrice || 0,
      // cantidad y dirección se mantienen igual
    };
    setItems(newItems);
    setArticleSuggestions([]);
    setActiveArticleIdx(null);
  };

  // Para crear una nueva línea con TAB
  const handleKeyDown = (e, idx, field) => {
    if (e.key === "Tab" && idx === items.length - 1 && field === "salePrice" && !e.shiftKey) {
      e.preventDefault();
      addItem();
    }
  };

  const calculateTotal = (quantity, salePrice) => {
    return (quantity * salePrice).toFixed(2);
  };

  const isDateDisabled = (date) => {
    // Solo permite seleccionar fechas de HOY en adelante
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // --- Creación de pedido REAL ---
  const createOrder = async () => {
    // Validación básica antes de enviar
    if (!selectedCustomer?.cardCode) return alert("Debes seleccionar un cliente.");
    if (!selectedPickup) return alert("Selecciona dirección de recolección.");
    if (!selectedDelivery) return alert("Selecciona dirección de envío.");
    if (!pickupDate) return alert("Selecciona fecha de recolección.");
    if (!items || items.length === 0) return alert("Debes agregar al menos un artículo.");

    // NUEVA VALIDACIÓN: ningún item debe ir vacío
    const validItems = items.filter(i => i.itemCode && i.description && i.quantity > 0);
    if (validItems.length === 0) {
      return alert("Agrega al menos un artículo válido al pedido.");
    }
    if (validItems.length < items.length) {
      return alert("Elimina líneas de artículos incompletos.");
    }

    const payload = {
      cardCode: selectedCustomer.cardCode,
      pickupAddress: selectedPickup,
      deliveryAddress: selectedDelivery,
      pickupDate,
      comment,
      discount,
      volumen: 0,
      volumenUnit: "kg",
      createdBy: localStorage.getItem("auth") || "desconocido",
      items: validItems.map(i => ({
        itemCode: i.itemCode,   // 100% seguro aquí, nunca undefined
        description: i.description,
        unit: i.unit,
        quantity: i.quantity,
        salePrice: i.salePrice,
        deliveryAddress: i.deliveryAddress
      })),
    };

    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al crear pedido");
      const data = await res.json();
      setDocNumber(data.docNum || "AUTO"); // Actualiza número correlativo si el backend lo retorna
      alert(`Pedido creado con éxito. Documento: ${data.docNum}`);
      navigate("/ventas");
    } catch (error) {
      console.error("Error enviando pedido:", error);
      alert("Error al crear el pedido. Intenta nuevamente.");
    }
  };

  const fetchCorrelativo = async (cardCode) => {
    if (!cardCode) {
      setDocNumber("AUTO");
      return;
    }
    try {
      const res = await fetch(`/api/quotations/correlativo?cardCode=${encodeURIComponent(cardCode)}`);
      const data = await res.json();
      setDocNumber(data.docNum || "AUTO");
    } catch {
      setDocNumber("AUTO");
    }
  };
  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Crear Pedido de Recolección</h1>
        <Button onClick={() => navigate("/ventas")} className="bg-primary text-white hover:bg-secondary">
          <LucideSkipBack className="w-4 h-4 mr-2" />
        </Button>
      </header>

      {/* --------- DATOS GENERALES --------- */}
      <section className="bg-white p-4 rounded shadow mb-6 text-sm">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          {/* Izquierda */}
          <div className="flex-1 min-w-[220px]">
            <div className="mb-2">
              <label className="block text-xs font-medium">Código Cliente</label>
              <div className="relative flex gap-2">
                <Input
                  value={selectedCustomer?.cardCode || customerCode}
                  onChange={(e) => {
                    setCustomerCode(e.target.value);
                    setCustomerSearch(e.target.value);
                    setSelectedCustomer(null);
                  }}
                  placeholder="Código Cliente"
                  className="text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-1 top-1 p-1"
                  onClick={handleSearchCustomer}
                  tabIndex={-1}
                >
                  <Search className="text-gray-400 w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-xs font-medium">Nombre Cliente</label>
              <Input
                value={selectedCustomer?.CardName || ""}
                placeholder="Nombre del Cliente"
                className="text-sm"
                readOnly
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-medium">Dirección Recolección</label>
              <select
                value={selectedPickup}
                onChange={e => setSelectedPickup(e.target.value)}
                className="w-full border px-2 py-1 rounded"
              >
                <option value="">Selecciona dirección de recolección</option>
                {pickupAddresses.map(addr => (
                  <option key={addr.id} value={addr.id}>
                    {addr.street},{addr.country},{addr.city},{addr.zipCode}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-xs font-medium">Dirección Envío</label>
              <select
                value={selectedDelivery}
                onChange={e => setSelectedDelivery(e.target.value)}
                className="w-full border px-2 py-1 rounded"
              >
                <option value="">Selecciona dirección de envío</option>
                {deliveryAddresses.map(addr => (
                  <option key={addr.id} value={addr.id}>
                    {addr.street},{addr.country},{addr.city},{addr.zipCode}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex mt-3">
              <Button
                size="sm"
                variant="secondary"
                className="w-full"
                onClick={() => setShowAddressModal(true)}
              >
                <PlusCircle className="w-4 h-4 mr-1" />Nueva Dirección
              </Button>
            </div>
          </div>
          {/* Derecha */}
          <div className="flex-1 min-w-[220px] flex flex-col gap-2 md:items-end">
            <div className="mb-1 w-full md:w-72">
              <label className="block text-xs font-medium">Número Documento</label>
              <Input
                value={docNumber}
                readOnly
                placeholder="AUTO"
                className="text-sm"
              />
            </div>
            <div className="mb-1 w-full md:w-72">
              <label className="block text-xs font-medium">Fecha Documento</label>
              <input
                type="date"
                value={creationDate}
                disabled
                className="w-full border px-2 py-1 bg-gray-100 rounded text-sm"
              />
            </div>
            <div className="mb-1 w-full md:w-72">
              <label className="block text-xs font-medium">Fecha Recolección</label>
              <DatePicker
                selected={pickupDate}
                onChange={(date) => setPickupDate(date)}
                filterDate={(date) => !isDateDisabled(date)}
                dateFormat="yyyy-MM-dd"
                className="w-full border px-2 py-1 bg-gray-100 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --------- DETALLE ARTÍCULOS --------- */}
      <section className="bg-white p-4 rounded shadow text-sm">
        <h2 className="font-semibold mb-3">Detalle de Artículos</h2>
        <table className="min-w-full table-auto border border-gray-300 text-sm mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1"># Guía</th>
              <th className="border px-2 py-1">Código Artículo</th>
              <th className="border px-2 py-1">Descripción</th>
              <th className="border px-2 py-1">Unidad</th>
              <th className="border px-2 py-1">Cantidad</th>
              <th className="border px-2 py-1">Precio Unitario</th>
              <th className="border px-2 py-1">Total línea</th>
              <th className="border px-2 py-1">Dirección Envío</th>
              <th className="border px-2 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1 text-center text-gray-500">{idx + 1}</td>
                <td className="border px-2 py-1 relative">
  <div className="flex">
    <input
      value={item.itemCode}
      readOnly
      className="w-full border px-2 py-1 rounded-l bg-gray-100"
      onFocus={() => setActiveArticleIdx(idx)}
      placeholder="Código"
    />
    <Button
      size="icon"
      className="rounded-r border-l-0 px-2"
      type="button"
      onClick={async () => {
        setActiveArticleIdx(idx);
        // Trae todos los items solo la primera vez
        if (articleSuggestions.length === 0) {
          try {
            const res = await fetch("/api/items");
            const data = await res.json();
            setArticleSuggestions(data);
          } catch {
            setArticleSuggestions([]);
          }
        }
      }}
      style={{ minWidth: 36, minHeight: 36 }}
      tabIndex={-1}
      title="Buscar artículo"
    >
      <Search className="w-4 h-4" />
    </Button>
  </div>
  {activeArticleIdx === idx && (
    <div className="absolute bg-white border rounded shadow max-h-64 overflow-y-auto z-50 w-full left-0 top-10">
      <div className="p-2 flex">
        <input
          autoFocus
          type="text"
          placeholder="Filtrar por descripción..."
          className="flex-1 border-b px-2 py-1"
          onChange={e => {
            const filtro = e.target.value.toLowerCase();
            setArticleSuggestions(prev =>
              prev.filter(a =>
                a.description?.toLowerCase().includes(filtro)
              )
            );
          }}
        />
        <Button
          size="sm"
          variant="ghost"
          className="ml-1"
          onClick={() => setActiveArticleIdx(null)}
        >Cerrar</Button>
      </div>
      {articleSuggestions.length === 0 ? (
        <div className="p-2 text-gray-400">No hay resultados.</div>
      ) : (
        articleSuggestions
          .sort((a, b) => a.itemCode.localeCompare(b.itemCode))
          .map((a) => (
            <div
              key={a.itemCode}
              className="p-2 cursor-pointer hover:bg-blue-100"
              onClick={() => selectArticle(a, idx)}
            >
              <b>{a.itemCode}</b> - {a.description}
            </div>
          ))
      )}
    </div>
  )}
</td>
                <td className="border px-2 py-1">
                  <input
                    value={item.description}
                    className="w-full border px-2 py-1 rounded bg-gray-100"
                    readOnly
                    tabIndex={-1}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    value={item.unit}
                    className="w-full border px-2 py-1 rounded bg-gray-100"
                    readOnly
                  />
                </td>

                <td className="border px-2 py-1">
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    min="0"
                    value={item.salePrice}
                    className="w-full border px-2 py-1 rounded bg-gray-100"
                    readOnly
                    tabIndex={-1}
                  />
                </td>
                <td className="border px-2 py-1 text-center">
                  {calculateTotal(item.quantity, item.salePrice)}
                </td>
                <td className="border px-2 py-1">
                  <select
                    value={item.deliveryAddressId || selectedDelivery}
                    onChange={(e) => handleItemChange(idx, "deliveryAddressId", e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value={selectedDelivery}>Dirección principal</option>
                    {deliveryAddresses.map(addr => (
                      <option key={addr.id} value={addr.id}>{addr.address1}</option>
                    ))}
                  </select>
                </td>
                <td className="border px-2 py-1 text-center">
                  {items.length > 1 && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="p-1"
                      onClick={() => removeItem(idx)}
                      title="Eliminar fila"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button size="sm" onClick={addItem}>+ Agregar Artículo</Button>
        <section className="bg-white p-4 rounded shadow text-sm mt-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            {/* Comentario */}
            <div className="flex-1 min-w-[220px]">
              <label className="block text-xs font-medium mb-1">Comentario</label>
              <textarea
                className="w-full border rounded px-2 py-1 min-h-[60px]"
                placeholder="Escribe comentarios sobre el pedido..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>
            {/* Resumen */}
            <div className="flex-1 min-w-[220px] flex flex-col md:items-end gap-2">
              <div className="flex justify-between w-full md:w-72">
                <span className="font-semibold text-xs">SubTotal Pedido:</span>
                <span>
                  {items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.salePrice)), 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between w-full md:w-72">
                <span className="font-semibold text-xs">Total Descuento:</span>
                <input
                  type="number"
                  value={discount}
                  min="0"
                  className="border px-2 py-1 rounded w-24 text-right"
                  onChange={e => setDiscount(Number(e.target.value) || 0)}
                />
              </div>
              <div className="flex justify-between w-full md:w-72 border-t pt-1 font-bold">
                <span className="text-xs">Total:</span>
                <span>
                  {(items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.salePrice)), 0) - discount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-between">
          <Button size="sm" variant="success" onClick={createOrder}>Crear Pedido</Button>
        </div>
      </section>

      {/* Modal de búsqueda de clientes */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-40 flex justify-center items-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">Buscar Cliente</h3>
            <input
              className="border px-3 py-2 rounded w-full mb-2"
              placeholder="Buscar por nombre o código"
              value={customerSearch}
              onChange={e => setCustomerSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearchCustomer()}
            />
            <div className="h-48 overflow-y-auto border rounded mb-2">
              {customers.length === 0 ? (
                <div className="p-4 text-gray-400">No hay resultados.</div>
              ) : (
                customers.map((c) => (
                  <div
                    key={c.cardCode}
                    className="hover:bg-blue-100 cursor-pointer p-2 border-b"
                    onClick={() => {
                      setSelectedCustomer(c);
                      setCustomerCode(c.cardCode);
                      fetchCorrelativo(c.cardCode);
                      setShowCustomerModal(false);
                    }}
                  >
                    <div className="font-semibold">{c.CardName}</div>
                    <div className="text-xs text-gray-600">{c.cardCode} - {c.E_mail}</div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between gap-2 mt-2">
              <Button size="sm" variant="secondary" onClick={() => {
                setShowCustomerModal(false);
                navigate("/customersnew");
              }}>
                + Nuevo Cliente
              </Button>
              <Button size="sm" onClick={() => setShowCustomerModal(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear dirección */}
      {showAddressModal && selectedCustomer && (
        <AddressCreateModal
          open={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          customer={selectedCustomer}
          onSuccess={handleAddressCreated}
        />
      )}
    </div>
  );
}
