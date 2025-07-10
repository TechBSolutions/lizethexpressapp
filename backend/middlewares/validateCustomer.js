const { body, validationResult } = require('express-validator');

const validateCustomer = [
  body('CardName').notEmpty().withMessage('Name is required'),
  body('E_mail').isEmail().withMessage('Valid email is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateCustomer;
