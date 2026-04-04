const { body, query, param } = require('express-validator');
const { ALL_CATEGORIES } = require('../models/Transaction');

const createTransactionRules = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be income or expense'),
  body('category')
    .isIn(ALL_CATEGORIES)
    .withMessage(`Category must be one of: ${ALL_CATEGORIES.join(', ')}`),
  body('transaction_date')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('transaction_date must be a valid date (YYYY-MM-DD)'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters'),
];

const updateTransactionRules = [
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').optional().isIn(ALL_CATEGORIES).withMessage(`Invalid category`),
  body('transaction_date').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('Invalid date'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description too long'),
];

const listQueryRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be 1–100'),
  query('type').optional().isIn(['income', 'expense']).withMessage('type must be income or expense'),
  query('category').optional().isIn(ALL_CATEGORIES).withMessage('Invalid category'),
  query('start_date').optional().isDate().withMessage('start_date must be a valid date'),
  query('end_date').optional().isDate().withMessage('end_date must be a valid date'),
  query('sort_by').optional().isIn(['transaction_date', 'amount', 'createdAt']).withMessage('Invalid sort field'),
  query('sort_dir').optional().isIn(['ASC', 'DESC']).withMessage('sort_dir must be ASC or DESC'),
];

const idParam = [param('id').isInt({ min: 1 }).withMessage('Invalid transaction ID')];

module.exports = { createTransactionRules, updateTransactionRules, listQueryRules, idParam };
