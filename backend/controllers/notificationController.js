const nodemailer = require('nodemailer');
const twilio = require('twilio');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let twilioClient;
try {
  if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  }
} catch (error) {
  console.warn('Twilio not configured:', error.message);
}

exports.sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
  } catch (err) {
    console.error('Email send error:', err);
  }
};

exports.sendSMS = async (to, message) => {
  if (!twilioClient) {
    console.warn('Twilio not configured, skipping SMS');
    return;
  }
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
  } catch (err) {
    console.error('SMS send error:', err);
  }
};

exports.notifyNewLead = async (lead) => {
  const subject = 'New Lead Received - UrbanCruise LMS';
  const text = `🚗 New Lead Alert!\n\nCustomer: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone || 'N/A'}\nService: ${lead.service || 'N/A'}\nSource: ${lead.source}\n\nPlease follow up immediately!\n\nUrbanCruise Team`;

  // Send email notification
  await this.sendEmail(process.env.ADMIN_EMAIL || 'admin@urbancruise.in', subject, text);

  // Send SMS notification
  const smsText = `New Lead: ${lead.name} - ${lead.email} - ${lead.source}`;
  await this.sendSMS(process.env.ADMIN_PHONE || '+91-XXXXXXXXXX', smsText);
};

exports.sendDailySummary = async () => {
  try {
    const Lead = require('../models/Lead');

    // Get today's leads
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysLeads = await Lead.find({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const totalLeads = todaysLeads.length;
    const newLeads = todaysLeads.filter(lead => lead.status === 'new').length;
    const convertedLeads = todaysLeads.filter(lead => lead.status === 'converted').length;

    const subject = 'Daily Lead Summary - UrbanCruise LMS';
    const text = `📊 Daily Lead Summary - ${today.toDateString()}\n\nTotal Leads Today: ${totalLeads}\nNew Leads: ${newLeads}\nConverted: ${convertedLeads}\n\nSources:\n${getSourceBreakdown(todaysLeads)}\n\nUrbanCruise Team`;

    await this.sendEmail(process.env.ADMIN_EMAIL || 'admin@urbancruise.in', subject, text);
  } catch (error) {
    console.error('Daily summary error:', error);
  }
};

function getSourceBreakdown(leads) {
  const sources = {};
  leads.forEach(lead => {
    sources[lead.source] = (sources[lead.source] || 0) + 1;
  });

  return Object.entries(sources)
    .map(([source, count]) => `- ${source}: ${count}`)
    .join('\n');
}