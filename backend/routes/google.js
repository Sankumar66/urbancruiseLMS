const express = require('express');
const { fetchGoogleLeads, syncCampaignData, getKeywordData } = require('../controllers/googleController');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/fetch-leads', auth, authorize('admin', 'manager'), fetchGoogleLeads);
router.get('/campaigns', auth, authorize('admin', 'manager'), syncCampaignData);
router.get('/keywords', auth, authorize('admin', 'manager'), getKeywordData);

module.exports = router;