require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const customerRoutes = require('./routes/customer.routes');  // <--- Asegúrate que el nombre sea correcto
const geodbRoutes = require('./routes/geodb');
const addressRoutes = require('./routes/address.routes');
const itemRoutes = require('./routes/item.routes.js');
const quotationRoutes = require('./routes/quotation.routes.js'); // <--- Si usas quotation
const listpedidos = require ('./routes/pedidoslist.routes.js');
const UserRoutes = require(('./routes/users.routes.js'));
const RoleRoutes = require('./routes/roles.routes.js');

app.use((req, res, next) => {
  // Por ejemplo, usuario con id 1 logueado
  req.user = { id: 1 };
  next();
});

app.use(cors());
app.use(express.json());
app.use('/api/addresses', addressRoutes);
app.use('/api/geodb', geodbRoutes);
app.use('/api/customers', customerRoutes); // <--- ESTA LÍNEA DEBE IR, Y EL ARCHIVO DEBE EXPORTAR UN ROUTER VÁLIDO
app.use("/api/items", itemRoutes);
app.use("/api/quotations", quotationRoutes);// <--- Si usas quotation
app.use("/api/listpedidos",listpedidos);
app.use('/api/roles',RoleRoutes);
app.use("/api/users",UserRoutes);

app.get('/', (req, res) => {
  res.send('Lizeth Express API is running 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
