const { GoogleAdsApi } = require('google-ads-api');
const Lead = require('../models/Lead');

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

exports.fetchGoogleLeads = async (req, res) => {
  try {
    if (!process.env.GOOGLE_ADS_CLIENT_ID || process.env.GOOGLE_ADS_CLIENT_ID === 'your_google_ads_client_id') {
      console.warn('Google Ads API not configured, skipping lead fetch');
      return res ? res.json({ message: 'Google Ads API not configured' }) : null;
    }

    const customer = client.Customer({
      customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID || 'your_customer_id',
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
    });

    const response = await customer.query(`
      SELECT
        lead.lead_id,
        lead.campaign_name,
        lead.keyword_text,
        lead.email_address,
        lead.phone_number,
        lead.first_name,
        lead.last_name
      FROM lead
      WHERE lead.lead_status = 'SUBMITTED'
    `);

    const leads = response.map(lead => ({
      name: `${lead.first_name} ${lead.last_name}`,
      email: lead.email_address,
      phone: lead.phone_number,
      source: 'google',
      campaign: lead.campaign_name,
      keyword: lead.keyword_text,
    }));

    let newLeadsCount = 0;
    for (const leadData of leads) {
      const existingLead = await Lead.findOne({ email: leadData.email, source: 'google' });
      if (!existingLead && leadData.email) {
        await Lead.create(leadData);
        newLeadsCount++;
      }
    }

    const message = `Google leads fetched: ${leads.length} found, ${newLeadsCount} new leads added`;
    console.log(`🔍 ${message}`);

    return res ? res.json({ message, newLeads: newLeadsCount }) : { message, newLeads: newLeadsCount };
  } catch (err) {
    console.error('Google Ads API error:', err.message);
    // Return a default response object for cron jobs
    const defaultResponse = { message: 'Google Ads API error occurred', newLeads: 0 };
    return res ? res.status(500).json({ message: err.message }) : defaultResponse;
  }
};

exports.syncCampaignData = async (req, res) => {
  try {
    const customer = client.Customer({
      customer_id: 'your_customer_id',
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
    });

    const response = await customer.query(`
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.budget.amount_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM campaign
      WHERE campaign.status = 'ENABLED'
    `);

    const campaigns = response.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      budget: campaign.budget?.amount_micros / 1000000 || 0, // Convert micros to currency
      impressions: campaign.metrics?.impressions || 0,
      clicks: campaign.metrics?.clicks || 0,
      cost: campaign.metrics?.cost_micros / 1000000 || 0, // Convert micros to currency
      conversions: campaign.metrics?.conversions || 0,
    }));

    res.json({
      message: 'Campaign data synced successfully',
      campaigns
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getKeywordData = async (req, res) => {
  try {
    const customer = client.Customer({
      customer_id: 'your_customer_id',
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
    });

    const response = await customer.query(`
      SELECT
        keyword.text,
        keyword.match_type,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value
      FROM keyword_view
      WHERE metrics.impressions > 0
      ORDER BY metrics.clicks DESC
      LIMIT 100
    `);

    const keywords = response.map(keyword => ({
      text: keyword.text,
      matchType: keyword.match_type,
      impressions: keyword.metrics?.impressions || 0,
      clicks: keyword.metrics?.clicks || 0,
      cost: keyword.metrics?.cost_micros / 1000000 || 0, // Convert micros to currency
      conversions: keyword.metrics?.conversions || 0,
      conversionValue: keyword.metrics?.conversions_value || 0,
    }));

    res.json({
      message: 'Keyword data retrieved successfully',
      keywords
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};