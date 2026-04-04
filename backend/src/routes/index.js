const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/transactions', require('./transaction.routes'));
router.use('/dashboard', require('./dashboard.routes'));

router.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

module.exports = router;
