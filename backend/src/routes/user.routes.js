const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createUserRules, updateUserRules, idParam } = require('../validators/user.validators');

router.use(authenticate, authorize('admin'));

router.get('/', userController.list);
router.get('/:id', idParam, validate, userController.getById);
router.post('/', createUserRules, validate, userController.create);
router.patch('/:id', idParam, updateUserRules, validate, userController.update);
router.delete('/:id', idParam, validate, userController.remove);
router.patch('/:id/restore', idParam, validate, userController.restore);

module.exports = router;
