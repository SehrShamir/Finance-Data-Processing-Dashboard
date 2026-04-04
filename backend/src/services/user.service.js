const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');
const { User, Role } = require('../models');
const ApiError = require('../utils/ApiError');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

const ROLE_NAME_TO_ID = { viewer: 1, analyst: 2, admin: 3 };

const list = async (query) => {
  const { page, limit, offset } = getPagination(query);

  const where = {};
  if (query.role) {
    const roleId = ROLE_NAME_TO_ID[query.role];
    if (roleId) where.role_id = roleId;
  }
  if (query.is_active !== undefined) {
    where.is_active = query.is_active === 'true';
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    include: [{ model: Role, as: 'role' }],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    paranoid: false,
  });

  return { users: rows, pagination: getPaginationMeta(count, page, limit) };
};

const getById = async (id) => {
  const user = await User.findByPk(id, {
    include: [{ model: Role, as: 'role' }],
    paranoid: false,
  });
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  return user;
};

const create = async ({ name, email, password, role }) => {
  const roleId = ROLE_NAME_TO_ID[role];
  if (!roleId) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid role');

  const user = await User.create({
    name,
    email,
    password_hash: password,
    role_id: roleId,
  });

  return User.findByPk(user.id, { include: [{ model: Role, as: 'role' }] });
};

const update = async (id, data) => {
  const user = await User.findByPk(id, { paranoid: false });
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  const updates = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.email !== undefined) updates.email = data.email;
  if (data.is_active !== undefined) updates.is_active = data.is_active;
  if (data.role !== undefined) {
    const roleId = ROLE_NAME_TO_ID[data.role];
    if (!roleId) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid role');
    updates.role_id = roleId;
  }

  await user.update(updates);
  return User.findByPk(id, { include: [{ model: Role, as: 'role' }], paranoid: false });
};

const remove = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  await user.destroy();
};

const restore = async (id) => {
  const user = await User.findByPk(id, { paranoid: false });
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  if (!user.deletedAt) throw new ApiError(StatusCodes.BAD_REQUEST, 'User is not deleted');
  await user.restore();
  return User.findByPk(id, { include: [{ model: Role, as: 'role' }] });
};

module.exports = { list, getById, create, update, remove, restore };
