const express = require('express');
const { sendEmail, sendSMS } = require('../controllers/notificationController');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/email', auth, authorize('admin'), (req, res) => {
  const { to, subject, text } = req.body;
  sendEmail(to, subject, text);
  res.json({ message: 'Email sent' });
});

router.post('/sms', auth, authorize('admin'), (req, res) => {
  const { to, message } = req.body;
  sendSMS(to, message);
  res.json({ message: 'SMS sent' });
});

module.exports = router;