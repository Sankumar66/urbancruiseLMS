const express = require('express');
const { exportLeads } = require('../controllers/exportController');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/leads', auth, authorize('admin', 'manager'), exportLeads);

module.exports = router;