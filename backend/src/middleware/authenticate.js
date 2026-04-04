const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required');
  }

  const token = authHeader.slice(7);
  const decoded = jwt.verify(token, env.JWT_SECRET);
  req.user = { id: decoded.sub, role: decoded.role };
  next();
};

module.exports = authenticate;
