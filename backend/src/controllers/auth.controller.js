const { StatusCodes } = require('http-status-codes');
const authService = require('../services/auth.service');
const { success } = require('../utils/ApiResponse');

const register = async (req, res) => {
  const user = await authService.register(req.body);
  return success(res, { user }, 'Registration successful', StatusCodes.CREATED);
};

const login = async (req, res) => {
  const { token, user } = await authService.login(req.body);
  return success(res, { accessToken: token, user }, 'Login successful');
};

const me = async (req, res) => {
  const { User, Role } = require('../models');
  const user = await User.findByPk(req.user.id, {
    include: [{ model: Role, as: 'role' }],
  });
  return success(res, { user });
};

const changePassword = async (req, res) => {
  await authService.changePassword(req.user.id, req.body);
  return success(res, null, 'Password changed successfully');
};

module.exports = { register, login, me, changePassword };
