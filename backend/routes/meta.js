const express = require('express');
const { fetchMetaLeads, setupWebhook, handleWebhook, validateMetaToken } = require('../controllers/metaController');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/fetch-leads', auth, authorize('admin', 'manager'), fetchMetaLeads);
router.get('/webhook', setupWebhook);
router.post('/webhook', handleWebhook);
router.get('/validate-token', auth, authorize('admin'), validateMetaToken);

module.exports = router;