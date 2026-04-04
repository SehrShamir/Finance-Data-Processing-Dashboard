const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.get('/summary', dashboardController.summary);
router.get('/trends', dashboardController.trends);
router.get('/categories', dashboardController.categories);
router.get('/recent', dashboardController.recent);

module.exports = router;
