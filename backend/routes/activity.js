const express = require('express');
const { logActivity, getActivityLogs, getUserActivity, getRecentActivity } = require('../controllers/activityController');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/log', auth, logActivity);
router.get('/', auth, getActivityLogs);
router.get('/recent', auth, getRecentActivity);
router.get('/user/:userId', auth, getUserActivity);

module.exports = router;