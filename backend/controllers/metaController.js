const axios = require('axios');
const Lead = require('../models/Lead');

exports.fetchMetaLeads = async (req, res) => {
  try {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const adAccountId = process.env.META_AD_ACCOUNT_ID || 'your_ad_account_id';

    if (!accessToken || accessToken === 'your_meta_access_token') {
      console.warn('Meta API not configured, skipping lead fetch');
      return res ? res.json({ message: 'Meta API not configured' }) : null;
    }

    const response = await axios.get(`https://graph.facebook.com/v18.0/${adAccountId}/leads`, {
      params: {
        access_token: accessToken,
        fields: 'id,created_time,field_data',
      },
    });

    const leads = response.data.data.map(lead => ({
      name: lead.field_data.find(f => f.name === 'full_name')?.values[0] || '',
      email: lead.field_data.find(f => f.name === 'email')?.values[0] || '',
      phone: lead.field_data.find(f => f.name === 'phone_number')?.values[0] || '',
      source: 'meta',
      campaign: lead.field_data.find(f => f.name === 'campaign_name')?.values[0] || '',
    }));

    let newLeadsCount = 0;
    for (const leadData of leads) {
      const existingLead = await Lead.findOne({ email: leadData.email, source: 'meta' });
      if (!existingLead && leadData.email) {
        await Lead.create(leadData);
        newLeadsCount++;
      }
    }

    const message = `Meta leads fetched: ${leads.length} found, ${newLeadsCount} new leads added`;
    console.log(`📘 ${message}`);

    return res ? res.json({ message, newLeads: newLeadsCount }) : { message, newLeads: newLeadsCount };
  } catch (err) {
    console.error('Meta API error:', err.message);
    // Return a default response object for cron jobs
    const defaultResponse = { message: 'Meta API error occurred', newLeads: 0 };
    return res ? res.status(500).json({ message: err.message }) : defaultResponse;
  }
};

exports.setupWebhook = async (req, res) => {
  try {
    const { verify_token, challenge } = req.query;

    // Verify webhook token
    if (verify_token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403).send('Verification failed');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const { entry, object } = req.body;

    if (object === 'page') {
      for (const pageEntry of entry) {
        for (const change of pageEntry.changes) {
          if (change.field === 'leadgen') {
            const leadData = change.value;

            // Extract lead information
            const lead = {
              name: leadData.field_data.find(f => f.name === 'full_name')?.values[0] || '',
              email: leadData.field_data.find(f => f.name === 'email')?.values[0] || '',
              phone: leadData.field_data.find(f => f.name === 'phone_number')?.values[0] || '',
              source: 'meta',
              campaign: leadData.campaign_name || '',
            };

            // Check for existing lead
            const existingLead = await Lead.findOne({
              where: { email: lead.email, source: 'meta' }
            });

            if (!existingLead) {
              await Lead.create(lead);
              console.log('New Meta lead created via webhook:', lead.email);
            }
          }
        }
      }
    }

    res.status(200).send('EVENT_RECEIVED');
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.validateMetaToken = async (req, res) => {
  try {
    const accessToken = process.env.META_ACCESS_TOKEN;

    const response = await axios.get('https://graph.facebook.com/me', {
      params: {
        access_token: accessToken,
        fields: 'id,name',
      },
    });

    if (response.data.id) {
      res.json({
        valid: true,
        message: 'Meta access token is valid',
        data: response.data
      });
    } else {
      res.status(400).json({ valid: false, message: 'Invalid token' });
    }
  } catch (err) {
    res.status(400).json({
      valid: false,
      message: 'Token validation failed',
      error: err.message
    });
  }
};