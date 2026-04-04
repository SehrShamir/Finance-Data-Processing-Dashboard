const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  if (err.type === 'validation') {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors,
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'field';
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }


  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
    });
  }


  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }


  console.error('Unhandled error:', err);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};

module.exports = errorHandler;
