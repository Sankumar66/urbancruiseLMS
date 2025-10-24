const ExcelJS = require('exceljs');
const csv = require('csv-parser');
const fs = require('fs');
const Lead = require('../models/Lead');
const axios = require('axios');

exports.importLeads = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    const leads = [];

    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      // Handle Excel files
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);

      const worksheet = workbook.worksheets[0];
      const headers = [];

      // Get headers from first row
      worksheet.getRow(1).eachCell((cell, colNumber) => {
        headers[colNumber - 1] = cell.value?.toString().toLowerCase().trim();
      });

      // Process data rows
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row

        const leadData = {};
        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber - 1];
          if (header) {
            leadData[header] = cell.value?.toString().trim() || '';
          }
        });

        // Map to our schema
        const mappedLead = {
          name: leadData.name || leadData['full name'] || leadData.fullname || '',
          email: leadData.email || '',
          phone: leadData.phone || leadData.mobile || leadData.contact || '',
          service: leadData.service || leadData['service type'] || 'GENERAL',
          vehicle: leadData.vehicle || leadData['vehicle type'] || '',
          city: leadData.city || leadData.location || '',
          rentalDays: leadData['rental days'] || leadData.rentaldays || leadData.days || '',
          rentalMonths: leadData['rental months'] || leadData.rentalmonths || leadData.months || '',
          source: leadData.source || 'import',
          campaign: leadData.campaign || leadData['campaign name'] || '',
          keyword: leadData.keyword || leadData.keywords || '',
          status: leadData.status || 'new',
          notes: leadData.notes || leadData.description || leadData.comments ? [leadData.notes || leadData.description || leadData.comments] : []
        };

        if (mappedLead.name && mappedLead.email) {
          leads.push(mappedLead);
        }
      });

    } else if (fileExtension === 'csv') {
      // Handle CSV files
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          results.forEach(row => {
            const mappedLead = {
              name: row.Name || row.name || row['Full Name'] || row.fullname || '',
              email: row.Email || row.email || '',
              phone: row.Phone || row.phone || row.Mobile || row.mobile || row.Contact || row.contact || '',
              service: row.Service || row.service || row['Service Type'] || row.servicetype || 'GENERAL',
              vehicle: row.Vehicle || row.vehicle || row['Vehicle Type'] || row.vehicletype || '',
              city: row.City || row.city || row.Location || row.location || '',
              rentalDays: row['Rental Days'] || row.rentalDays || row.Days || row.days || '',
              rentalMonths: row['Rental Months'] || row.rentalMonths || row.Months || row.months || '',
              source: row.Source || row.source || 'import',
              campaign: row.Campaign || row.campaign || row['Campaign Name'] || row.campaignname || '',
              keyword: row.Keyword || row.keyword || row.Keywords || row.keywords || '',
              status: row.Status || row.status || 'new',
              notes: row.Notes || row.notes || row.Description || row.description || row.Comments || row.comments ? [row.Notes || row.notes || row.Description || row.description || row.Comments || row.comments] : []
            };

            if (mappedLead.name && mappedLead.email) {
              leads.push(mappedLead);
            }
          });
        });
    }

    // Wait for CSV processing to complete
    if (fileExtension === 'csv') {
      await new Promise((resolve) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('end', resolve);
      });
    }

    // Import leads to database
    let importedCount = 0;
    let skippedCount = 0;

    for (const leadData of leads) {
      try {
        // Check if lead already exists
        const existingLead = await Lead.findOne({
          email: leadData.email,
          source: leadData.source
        });

        if (!existingLead) {
          await Lead.create(leadData);
          importedCount++;
        } else {
          skippedCount++;
        }
      } catch (error) {
        console.error('Error importing lead:', error);
        skippedCount++;
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      message: `Import completed. ${importedCount} leads imported, ${skippedCount} skipped (duplicates)`,
      imported: importedCount,
      skipped: skippedCount
    });

  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ message: 'Import failed', error: error.message });
  }
};

exports.importLeadsFromUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Fetch data from URL
    const response = await axios.get(url);
    const data = response.data;

    // Process the data (assuming it's JSON array of leads)
    let leads = [];
    if (Array.isArray(data)) {
      leads = data;
    } else if (data.leads && Array.isArray(data.leads)) {
      leads = data.leads;
    } else {
      return res.status(400).json({ message: 'Invalid data format from URL' });
    }

    // Import leads to database
    let importedCount = 0;
    let skippedCount = 0;

    for (const leadData of leads) {
      try {
        // Map fields to our schema
        const mappedLead = {
          name: leadData.name || leadData.fullName || leadData.full_name || '',
          email: leadData.email || '',
          phone: leadData.phone || leadData.mobile || leadData.contact || '',
          service: leadData.service || leadData.serviceType || 'GENERAL',
          vehicle: leadData.vehicle || leadData.vehicleType || '',
          city: leadData.city || leadData.location || '',
          rentalDays: leadData.rentalDays || leadData.days || '',
          rentalMonths: leadData.rentalMonths || leadData.months || '',
          source: leadData.source || 'url_import',
          campaign: leadData.campaign || leadData.campaignName || '',
          keyword: leadData.keyword || leadData.keywords || '',
          status: leadData.status || 'new',
          notes: leadData.notes || leadData.description || leadData.comments ? [leadData.notes || leadData.description || leadData.comments] : []
        };

        // Check if lead already exists
        const existingLead = await Lead.findOne({
          email: mappedLead.email,
          source: mappedLead.source
        });

        if (!existingLead && mappedLead.name && mappedLead.email) {
          await Lead.create(mappedLead);
          importedCount++;
        } else {
          skippedCount++;
        }
      } catch (error) {
        console.error('Error importing lead from URL:', error);
        skippedCount++;
      }
    }

    res.json({
      message: `Import from URL completed. ${importedCount} leads imported, ${skippedCount} skipped`,
      imported: importedCount,
      skipped: skippedCount
    });

  } catch (error) {
    console.error('URL import error:', error);
    res.status(500).json({ message: 'URL import failed', error: error.message });
  }
};