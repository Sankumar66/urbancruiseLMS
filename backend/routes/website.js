const express = require('express');
const { createWebsiteLead, scrapeUrbanCruiseData, getUrbanCruiseAnalytics } = require('../controllers/websiteController');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/leads', createWebsiteLead);
router.get('/scrape-urbancruise', auth, authorize('admin'), scrapeUrbanCruiseData);
router.get('/analytics-urbancruise', auth, authorize('admin', 'manager'), getUrbanCruiseAnalytics);

module.exports = router;