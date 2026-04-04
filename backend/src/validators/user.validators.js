const { body, param } = require('express-validator');

const createUserRules = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('role')
    .isIn(['viewer', 'analyst', 'admin'])
    .withMessage('Role must be viewer, analyst, or admin'),
];

const updateUserRules = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email').optional().trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('role')
    .optional()
    .isIn(['viewer', 'analyst', 'admin'])
    .withMessage('Role must be viewer, analyst, or admin'),
  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
];

const idParam = [param('id').isInt({ min: 1 }).withMessage('Invalid user ID')];

module.exports = { createUserRules, updateUserRules, idParam };
