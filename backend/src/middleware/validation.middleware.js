const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorArray = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return next(new ValidationError('Validation failed', errorArray));
  }
  next();
};

module.exports = validate;
