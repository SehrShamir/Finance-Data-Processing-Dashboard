const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');
const { Transaction, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

// Viewer sees only own records; analyst/admin see all
const buildScope = (requestingUser) => {
  if (requestingUser.role === 'viewer') {
    return { user_id: requestingUser.id };
  }
  return {};
};

// Analyst can only mutate their own records; admin can mutate any
const assertOwnershipOrAdmin = (transaction, requestingUser) => {
  if (requestingUser.role === 'admin') return;
  if (String(transaction.user_id) !== String(requestingUser.id)) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You can only modify your own transactions');
  }
};

const list = async (query, requestingUser) => {
  const { page, limit, offset } = getPagination(query);
  const scope = buildScope(requestingUser);

  const where = { ...scope };

  if (query.type) where.type = query.type;
  if (query.category) where.category = query.category;
  if (query.start_date || query.end_date) {
    where.transaction_date = {};
    if (query.start_date) where.transaction_date[Op.gte] = query.start_date;
    if (query.end_date) where.transaction_date[Op.lte] = query.end_date;
  }

  const sortBy = query.sort_by || 'transaction_date';
  const sortDir = query.sort_dir || 'DESC';

  const { count, rows } = await Transaction.findAndCountAll({
    where,
    limit,
    offset,
    order: [[sortBy, sortDir]],
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
  });

  return { transactions: rows, pagination: getPaginationMeta(count, page, limit) };
};

const getById = async (id, requestingUser) => {
  const scope = buildScope(requestingUser);
  const transaction = await Transaction.findOne({
    where: { id, ...scope },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
  });

  if (!transaction) throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found');
  return transaction;
};

const create = async (data, requestingUser) => {
  const transaction = await Transaction.create({
    user_id: requestingUser.id,
    amount: data.amount,
    type: data.type,
    category: data.category,
    description: data.description || null,
    transaction_date: data.transaction_date,
  });

  return Transaction.findByPk(transaction.id, {
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
  });
};

const update = async (id, data, requestingUser) => {
  const transaction = await Transaction.findByPk(id);
  if (!transaction) throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found');

  assertOwnershipOrAdmin(transaction, requestingUser);

  const updates = {};
  if (data.amount !== undefined) updates.amount = data.amount;
  if (data.type !== undefined) updates.type = data.type;
  if (data.category !== undefined) updates.category = data.category;
  if (data.description !== undefined) updates.description = data.description;
  if (data.transaction_date !== undefined) updates.transaction_date = data.transaction_date;

  await transaction.update(updates);

  return Transaction.findByPk(id, {
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
  });
};

const remove = async (id, requestingUser) => {
  const transaction = await Transaction.findByPk(id);
  if (!transaction) throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found');

  assertOwnershipOrAdmin(transaction, requestingUser);
  await transaction.destroy();
};

module.exports = { list, getById, create, update, remove };
