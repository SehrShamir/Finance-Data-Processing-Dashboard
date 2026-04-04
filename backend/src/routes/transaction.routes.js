const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const {
  createTransactionRules,
  updateTransactionRules,
  listQueryRules,
  idParam,
} = require('../validators/transaction.validators');

// All transaction routes require authentication
router.use(authenticate);

router.get('/', listQueryRules, validate, transactionController.list);
router.get('/:id', idParam, validate, transactionController.getById);
router.post('/', authorize('analyst', 'admin'), createTransactionRules, validate, transactionController.create);
router.put('/:id', authorize('analyst', 'admin'), idParam, updateTransactionRules, validate, transactionController.update);
router.delete('/:id', authorize('analyst', 'admin'), idParam, validate, transactionController.remove);

module.exports = router;
