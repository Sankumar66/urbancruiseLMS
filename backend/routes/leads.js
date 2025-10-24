const express = require('express');
const { getLeads, getLead, createLead, updateLead, deleteLead, assignLead, filterLeads } = require('../controllers/leadController');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// API v1 routes
router.get('/v1/leads', getLeads);
router.get('/v1/leads/filter', filterLeads);
router.get('/v1/leads/:id', getLead);
router.post('/v1/leads', createLead);
router.put('/v1/leads/:id', updateLead);
router.put('/v1/leads/:id/assign', assignLead);
router.delete('/v1/leads/:id', deleteLead);

// Legacy routes (remove auth temporarily for testing)
router.get('/', getLeads);
router.get('/filter', filterLeads);
router.get('/:id', getLead);
router.post('/', createLead);
router.put('/:id', updateLead);
router.put('/:id/assign', assignLead);
router.delete('/:id', deleteLead);

module.exports = router;