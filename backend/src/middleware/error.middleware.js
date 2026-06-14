const env = require('../config/env');
const logger = require('../utils/logger');
const statusCodes = require('../constants/statusCodes');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return { message, statusCode: statusCodes.BAD_REQUEST };
};

const handleDuplicateFieldsDB = (err) => {
  const errmsg = err.errmsg || err.message || '';
  const match = errmsg.match(/(["'])(\\?.)*?\1/);
  const value = match ? match[0] : 'unknown';
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return { message, statusCode: statusCodes.CONFLICT };
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return { message, statusCode: statusCodes.BAD_REQUEST };
};

const handleJWTError = () => ({
  message: 'Invalid token. Please log in again!',
  statusCode: statusCodes.UNAUTHORIZED,
});

const handleJWTExpiredError = () => ({
  message: 'Your token has expired! Please log in again.',
  statusCode: statusCodes.UNAUTHORIZED,
});

const sendErrorDev = (err, req, res) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  res.status(err.statusCode || statusCodes.INTERNAL_SERVER_ERROR).json({
    status: err.status || 'error',
    error: err,
    message: err.message,
    errors: err.errors || [],
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // Programming or other unknown error: don't leak error details
  logger.error('ERROR 💥', err);
  res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Something went wrong on the server.',
  });
};

module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;
  error.name = err.name;
  error.errors = err.errors;
  error.isOperational = err.isOperational;
  error.statusCode = err.statusCode || statusCodes.INTERNAL_SERVER_ERROR;
  error.status = err.status || 'error';
  error.code = err.code;
  error.errmsg = err.errmsg;

  if (error.name === 'CastError') {
    const dbErr = handleCastErrorDB(error);
    error.message = dbErr.message;
    error.statusCode = dbErr.statusCode;
    error.isOperational = true;
  }
  if (error.code === 11000) {
    const dbErr = handleDuplicateFieldsDB(error);
    error.message = dbErr.message;
    error.statusCode = dbErr.statusCode;
    error.isOperational = true;
  }
  if (error.name === 'ValidationError') {
    const dbErr = handleValidationErrorDB(error);
    error.message = dbErr.message;
    error.statusCode = dbErr.statusCode;
    error.isOperational = true;
  }
  if (error.name === 'JsonWebTokenError') {
    const jwtErr = handleJWTError();
    error.message = jwtErr.message;
    error.statusCode = jwtErr.statusCode;
    error.isOperational = true;
  }
  if (error.name === 'TokenExpiredError') {
    const jwtErr = handleJWTExpiredError();
    error.message = jwtErr.message;
    error.statusCode = jwtErr.statusCode;
    error.isOperational = true;
  }

  // Sync status string with the normalized statusCode
  error.status = `${error.statusCode}`.startsWith('4') ? 'fail' : 'error';

  if (env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};
