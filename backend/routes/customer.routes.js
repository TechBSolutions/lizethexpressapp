// backend/routes/customer.routes.js

const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller.js");

// Listar todos
router.get("/", customerController.getAllCustomers);

// Crear cliente
router.post("/", customerController.createCustomer);

// Buscar por código de cliente
router.get("/:cardCode", customerController.getCustomerByCardCode);

// Editar cliente
router.put("/:cardCode", customerController.updateCustomer);

// PATCH: Deshabilitar cliente
router.patch("/:cardCode/disable", customerController.disableCustomer);
// PATCH: Habilitar cliente
router.patch("/:cardCode/enable", customerController.enableCustomer);

module.exports = router;
