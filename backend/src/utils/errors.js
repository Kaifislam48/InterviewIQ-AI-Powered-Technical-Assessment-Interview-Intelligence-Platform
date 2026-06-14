const statusCodes = require('../constants/statusCodes');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, statusCodes.BAD_REQUEST);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, statusCodes.UNAUTHORIZED);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, statusCodes.FORBIDDEN);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, statusCodes.NOT_FOUND);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, statusCodes.CONFLICT);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = []) {
    super(message, statusCodes.UNPROCESSABLE_ENTITY);
    this.errors = errors;
  }
}

class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests, please try again later') {
    super(message, statusCodes.TOO_MANY_REQUESTS);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  TooManyRequestsError,
};
