const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required');
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Insufficient permissions');
    }
    next();
  };
};

module.exports = authorize;
