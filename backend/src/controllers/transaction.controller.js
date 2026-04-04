const { StatusCodes } = require('http-status-codes');
const transactionService = require('../services/transaction.service');
const { success, paginated } = require('../utils/ApiResponse');

const list = async (req, res) => {
  const { transactions, pagination } = await transactionService.list(req.query, req.user);
  return paginated(res, transactions, pagination);
};

const getById = async (req, res) => {
  const transaction = await transactionService.getById(req.params.id, req.user);
  return success(res, { transaction });
};

const create = async (req, res) => {
  const transaction = await transactionService.create(req.body, req.user);
  return success(res, { transaction }, 'Transaction created', StatusCodes.CREATED);
};

const update = async (req, res) => {
  const transaction = await transactionService.update(req.params.id, req.body, req.user);
  return success(res, { transaction }, 'Transaction updated');
};

const remove = async (req, res) => {
  await transactionService.remove(req.params.id, req.user);
  return success(res, null, 'Transaction deleted');
};

module.exports = { list, getById, create, update, remove };
