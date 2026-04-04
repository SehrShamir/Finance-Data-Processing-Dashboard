const { Op, fn, col, literal } = require('sequelize');
const sequelize = require('../config/database');
const { Transaction } = require('../models');

const buildDateScope = (query) => {
  if (!query.start_date && !query.end_date) return {};
  const dateWhere = {};
  if (query.start_date) dateWhere[Op.gte] = query.start_date;
  if (query.end_date) dateWhere[Op.lte] = query.end_date;
  return { transaction_date: dateWhere };
};

const buildUserScope = (user) =>
  user.role === 'viewer' ? { user_id: user.id } : {};

const getSummary = async (query, requestingUser) => {
  const where = {
    ...buildUserScope(requestingUser),
    ...buildDateScope(query),
  };

  const rows = await Transaction.findAll({
    where,
    attributes: [
      'type',
      [fn('SUM', col('amount')), 'total'],
      [fn('COUNT', col('id')), 'count'],
    ],
    group: ['type'],
    raw: true,
  });

  let totalIncome = 0;
  let totalExpense = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  rows.forEach((row) => {
    if (row.type === 'income') {
      totalIncome = parseFloat(row.total) || 0;
      incomeCount = parseInt(row.count) || 0;
    } else {
      totalExpense = parseFloat(row.total) || 0;
      expenseCount = parseInt(row.count) || 0;
    }
  });

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    transactionCount: incomeCount + expenseCount,
    incomeCount,
    expenseCount,
  };
};

const getTrends = async (query, requestingUser) => {
  const months = Math.min(24, Math.max(1, parseInt(query.months) || 12));
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months + 1);
  startDate.setDate(1);

  const where = {
    ...buildUserScope(requestingUser),
    transaction_date: { [Op.gte]: startDate },
  };

  const rows = await Transaction.findAll({
    where,
    attributes: [
      [fn('DATE_FORMAT', col('transaction_date'), '%Y-%m'), 'month'],
      'type',
      [fn('SUM', col('amount')), 'total'],
    ],
    group: [literal("DATE_FORMAT(transaction_date, '%Y-%m')"), 'type'],
    order: [[literal("DATE_FORMAT(transaction_date, '%Y-%m')"), 'ASC']],
    raw: true,
  });

  const monthMap = {};
  rows.forEach((row) => {
    if (!monthMap[row.month]) monthMap[row.month] = { month: row.month, income: 0, expense: 0 };
    monthMap[row.month][row.type] = parseFloat(row.total) || 0;
  });

  const result = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    result.push(monthMap[key] || { month: key, income: 0, expense: 0 });
  }

  return result;
};

const getCategories = async (query, requestingUser) => {
  const where = {
    ...buildUserScope(requestingUser),
    ...buildDateScope(query),
  };

  const rows = await Transaction.findAll({
    where,
    attributes: [
      'type',
      'category',
      [fn('SUM', col('amount')), 'total'],
      [fn('COUNT', col('id')), 'count'],
    ],
    group: ['type', 'category'],
    order: [['type', 'ASC'], [fn('SUM', col('amount')), 'DESC']],
    raw: true,
  });

  const typeTotals = {};
  rows.forEach((row) => {
    typeTotals[row.type] = (typeTotals[row.type] || 0) + parseFloat(row.total);
  });

  return rows.map((row) => ({
    type: row.type,
    category: row.category,
    total: parseFloat(row.total),
    count: parseInt(row.count),
    percentage: typeTotals[row.type]
      ? Math.round((parseFloat(row.total) / typeTotals[row.type]) * 10000) / 100
      : 0,
  }));
};

const getRecent = async (requestingUser) => {
  const where = buildUserScope(requestingUser);

  return Transaction.findAll({
    where,
    limit: 10,
    order: [['transaction_date', 'DESC'], ['createdAt', 'DESC']],
    include: [
      { model: require('../models').User, as: 'user', attributes: ['id', 'name'] },
    ],
  });
};

module.exports = { getSummary, getTrends, getCategories, getRecent };
