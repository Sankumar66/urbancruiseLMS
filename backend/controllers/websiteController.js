const axios = require('axios');
const Lead = require('../models/Lead');
const { notifyNewLead } = require('./notificationController');

exports.createWebsiteLead = async (req, res) => {
  try {
    const { name, email, phone, service } = req.body;
    const lead = new Lead({
      name,
      email,
      phone,
      service,
      source: 'website',
    });
    await lead.save();

    // Send notification
    await notifyNewLead(lead);

    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.scrapeUrbanCruiseData = async (req, res) => {
  try {
    // For demo purposes, we'll simulate scraping data from urbancruise.in
    // In production, you would use puppeteer or similar to scrape the actual website

    const scrapedData = {
      companyName: 'UrbanCruise',
      services: [
        'Web Development',
        'Mobile App Development',
        'Digital Marketing',
        'SEO Services',
        'E-commerce Solutions',
        'Logo Design'
      ],
      contactInfo: {
        email: 'info@urbancruise.in',
        phone: '+91-XXXXXXXXXX',
        website: 'https://urbancruise.in'
      },
      stats: {
        projectsCompleted: 150,
        happyClients: 85,
        yearsExperience: 5,
        teamSize: 25
      },
      recentProjects: [
        { name: 'E-commerce Platform', client: 'Fashion Brand', status: 'completed' },
        { name: 'Mobile Banking App', client: 'FinTech Company', status: 'in-progress' },
        { name: 'Corporate Website', client: 'Manufacturing Co.', status: 'completed' }
      ]
    };

    res.json({
      message: 'UrbanCruise data scraped successfully',
      data: scrapedData
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUrbanCruiseAnalytics = async (req, res) => {
  try {
    // Simulate analytics data from urbancruise.in
    const analytics = {
      monthlyVisitors: [
        { month: 'Jan', visitors: 1200 },
        { month: 'Feb', visitors: 1350 },
        { month: 'Mar', visitors: 1180 },
        { month: 'Apr', visitors: 1420 },
        { month: 'May', visitors: 1680 },
        { month: 'Jun', visitors: 1520 }
      ],
      servicePopularity: [
        { service: 'Web Development', leads: 45 },
        { service: 'Mobile Apps', leads: 32 },
        { service: 'Digital Marketing', leads: 28 },
        { service: 'SEO', leads: 22 },
        { service: 'E-commerce', leads: 18 },
        { service: 'Logo Design', leads: 15 }
      ],
      conversionRates: [
        { source: 'Organic Search', rate: 3.2 },
        { source: 'Social Media', rate: 2.8 },
        { source: 'Direct', rate: 4.1 },
        { source: 'Email', rate: 5.5 },
        { source: 'Paid Ads', rate: 2.1 }
      ],
      revenueByService: [
        { service: 'Web Development', revenue: 250000 },
        { service: 'Mobile Apps', revenue: 180000 },
        { service: 'Digital Marketing', revenue: 95000 },
        { service: 'SEO', revenue: 75000 },
        { service: 'E-commerce', revenue: 120000 }
      ]
    };

    res.json({
      message: 'UrbanCruise analytics retrieved successfully',
      analytics
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};