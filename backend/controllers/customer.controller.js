const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  // Obtener todos los clientes
  getAllCustomers: async (req, res) => {
    try {
      const customers = await prisma.customer.findMany();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve customers.' });
    }
  },

  // Crear cliente
  createCustomer: async (req, res) => {
    const {
      CardName,
      CardType,
      Status,
      CntctPrsn,
      E_mail,
      Phone,
      UserWeb,
      PasswordWeb,
      Country,
      State,
      City,
      ZipCode,
      NIT,
      Address,
      Discount,
      CreditLin,
      Route
    } = req.body;

    try {
      let newCustomer = await prisma.customer.create({
        data: {
          CardName,
          CardType,
          Status,
          CntctPrsn,
          E_mail,
          Phone,
          UserWeb,
          PasswordWeb,
          Country,
          State,
          City,
          ZipCode,
          NIT,
          Address,
          Discount: Discount ? Number(Discount) : 0,
          CreditLin: CreditLin ? Number(CreditLin) : 0,
          Route: Route ? Number(Route) : 0,
          Create_date: new Date(),
          Modify_Date: new Date(),
        },
      });

      const paddedId = String(newCustomer.IDcard).padStart(6, '0');
      const cardCode = `CL-${paddedId}`;

      newCustomer = await prisma.customer.update({
        where: { IDcard: newCustomer.IDcard },
        data: { cardCode }
      });

      res.status(201).json(newCustomer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ error: 'Failed to create customer.', details: error.message });
    }
  },

  // Obtener cliente por cardCode
  getCustomerByCardCode: async (req, res) => {
    const { cardCode } = req.params;
    try {
      const customer = await prisma.customer.findFirst({
        where: { cardCode: cardCode }
      });
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve customer.' });
    }
  },

  // Actualizar cliente (por cardCode)
  updateCustomer: async (req, res) => {
    try {
      const { cardCode } = req.params;
      const data = req.body;
      // Evita actualizar el cardCode
      if (data.cardCode) delete data.cardCode;
      const updated = await prisma.customer.update({
        where: { cardCode },
        data
      });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "No se pudo actualizar el cliente", details: err.message });
    }
  },

  // Deshabilitar cliente
  disableCustomer: async (req, res) => {
    try {
      const { cardCode } = req.params;
      const updated = await prisma.customer.update({
        where: { cardCode },
        data: { Status: "Inactivo" }
      });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "No se pudo deshabilitar el cliente", details: err.message });
    }
  },

  // Habilitar cliente
  enableCustomer: async (req, res) => {
    try {
      const { cardCode } = req.params;
      const updated = await prisma.customer.update({
        where: { cardCode },
        data: { Status: "Activo" }
      });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "No se pudo habilitar el cliente", details: err.message });
    }
  },
};
