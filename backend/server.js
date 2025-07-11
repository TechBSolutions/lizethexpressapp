require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Rutas (ajusta los paths si es necesario)
const customerRoutes = require('./routes/customer.routes');
const geodbRoutes = require('./routes/geodb');
const addressRoutes = require('./routes/address.routes');
const itemRoutes = require('./routes/item.routes.js');
const quotationRoutes = require('./routes/quotation.routes.js');
const listpedidos = require ('./routes/pedidoslist.routes.js');
const UserRoutes = require('./routes/users.routes.js');
const RoleRoutes = require('./routes/roles.routes.js');

// CORS: SOLO permite requests desde tu frontend de Azure
const allowedOrigins = [
  'https://icy-sand-0b507ca10.1.azurestaticapps.net', // Tu frontend real en Azure
  'http://localhost:5173' // Opcional: desarrollo local
];

app.use(cors({
  origin: function(origin, callback) {
    // Permite requests sin origin (como curl, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('No autorizado por CORS: ' + origin), false);
  },
  credentials: true
}));

app.use(express.json());

// Simulación de usuario (si lo necesitas, si no, puedes eliminarlo)
app.use((req, res, next) => {
  req.user = { id: 1 };
  next();
});

// Rutas
app.use('/api/addresses', addressRoutes);
app.use('/api/geodb', geodbRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/listpedidos', listpedidos);
app.use('/api/roles', RoleRoutes);
app.use('/api/users', UserRoutes);

app.get('/', (req, res) => {
  res.send('Lizeth Express API is running 🚀');
});

// Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
