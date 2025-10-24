const cron = require('node-cron');
const { fetchMetaLeads } = require('./controllers/metaController');
const { fetchGoogleLeads } = require('./controllers/googleController');
const { sendDailySummary } = require('./controllers/notificationController');

// Schedule to run every hour for lead synchronization
cron.schedule('0 * * * *', async () => {
  console.log('🔄 Running scheduled lead fetch...');
  try {
    // Fetch leads from Meta Ads
    await fetchMetaLeads();
    console.log('✅ Meta leads fetched successfully');

    // Fetch leads from Google Ads
    await fetchGoogleLeads();
    console.log('✅ Google leads fetched successfully');

    console.log('🎉 Lead synchronization completed');
  } catch (err) {
    console.error('❌ Cron job error:', err);
  }
});

// Schedule daily summary at 9 AM IST (3:30 AM UTC)
cron.schedule('30 3 * * *', async () => {
  console.log('📊 Sending daily lead summary...');
  try {
    await sendDailySummary();
    console.log('✅ Daily summary sent successfully');
  } catch (err) {
    console.error('❌ Daily summary error:', err);
  }
});

// Schedule to run every 30 minutes for real-time sync
cron.schedule('*/30 * * * *', async () => {
  console.log('⚡ Running real-time lead sync...');
  try {
    const metaResult = await fetchMetaLeads();
    const googleResult = await fetchGoogleLeads();

    console.log('✅ Real-time sync completed');
    if (metaResult) console.log(`📘 Meta: ${metaResult.message}`);
    if (googleResult) console.log(`🔍 Google: ${googleResult.message}`);
  } catch (err) {
    console.error('❌ Real-time sync error:', err.message);
  }
});

console.log('🚀 Cron jobs initialized:');
console.log('   - Hourly lead sync: Every hour at :00');
console.log('   - Daily summary: 9:00 AM IST daily');
console.log('   - Real-time sync: Every 30 minutes');

module.exports = cron;