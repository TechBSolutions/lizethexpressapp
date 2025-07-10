import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ERPMainPage from './pages/Home'; // Este es tu Home actual
import VentasPage from './pages/ventas_Page';
import Pedidonuevo from './pages/pedido';
import CustomerList from './pages/CustomerList';
import CustomerCreate from './pages/CustomerCreate';
import InventoryMainPage from './pages/InventoryMainPage';
import CustomerDetail from './pages/CustomerDetail';
import ProductAdminPage from './pages/ProductAdminPage';
import CustomerEdit from "./pages/CustomerEdit";
import AddressEdit from "./pages/AddressEdit";
import ProductCreateModal from './pages/ProductCreateModal';
import LogisticsMainPage from './pages/LogisticsMainPage';
import PedidosListPage from './pages/PedidosListPage';
import ConfigMainPage from './pages/ConfigMainPage';
import RoleList from './pages/RoleList';
import RoleForm from './pages/RoleForm';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<ERPMainPage />} />
      <Route path="/ventas" element={<VentasPage />} />
      <Route path="/pedido" element={<Pedidonuevo />} />
      <Route path="/customers" element={<CustomerList />} />
      <Route path="/customersnew" element={<CustomerCreate />} />
      <Route path="/inventory" element={<InventoryMainPage />} />
      <Route path="/customer/:cardCode" element={<CustomerDetail />} />
      <Route path="/product-admin" element={< ProductAdminPage/>} />
      <Route path="/customer/edit/:cardCode" element={<CustomerEdit />} />
      <Route path="/addresses/edit/:idAddress" element={<AddressEdit />} />
      <Route path="/items" element={<ProductCreateModal />} />
      <Route path="/logistics" element={<LogisticsMainPage />} />
      <Route path="/listpedidos" element={<PedidosListPage />} />
      <Route path="/config" element={<ConfigMainPage />} />
      <Route path="/config/roles" element={<RoleList />} />
      <Route path="/config/roles/new" element={<RoleForm />} />
      <Route path="/config/roles/:id/edit" element={<RoleForm />} />
      <Route path="/config/users" element={<UserList />} />
      <Route path="/config/users/new" element={<UserForm />} />
      <Route path="/config/users/:id/edit" element={<UserForm />} />

    </Routes>
  );
}

export default App;
