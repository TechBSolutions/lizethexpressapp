const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');

router.get('/', addressController.getAddresses);
router.post('/', addressController.createAddress);
router.patch("/:idAddress/disable", addressController.disableAddress); // <-- AGREGAR ESTA LÍNEA
router.put("/:idAddress", addressController.updateAddress); // <-- AGREGAR ESTA LÍNEA
router.get("/:idAddress", addressController.getAddressById);
router.patch("/:idAddress/enable", addressController.enableAddress);

module.exports = router;
