const { StatusCodes } = require('http-status-codes');
const userService = require('../services/user.service');
const { success, paginated } = require('../utils/ApiResponse');

const list = async (req, res) => {
  const { users, pagination } = await userService.list(req.query);
  return paginated(res, users, pagination);
};

const getById = async (req, res) => {
  const user = await userService.getById(req.params.id);
  return success(res, { user });
};

const create = async (req, res) => {
  const user = await userService.create(req.body);
  return success(res, { user }, 'User created', StatusCodes.CREATED);
};

const update = async (req, res) => {
  const user = await userService.update(req.params.id, req.body);
  return success(res, { user }, 'User updated');
};

const remove = async (req, res) => {
  await userService.remove(req.params.id);
  return success(res, null, 'User deleted');
};

const restore = async (req, res) => {
  const user = await userService.restore(req.params.id);
  return success(res, { user }, 'User restored');
};

module.exports = { list, getById, create, update, remove, restore };
