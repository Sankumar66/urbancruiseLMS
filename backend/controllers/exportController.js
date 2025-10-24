const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const Lead = require('../models/Lead');

exports.exportLeads = async (req, res) => {
  try {
    const { format, source, status, dateFrom, dateTo } = req.query;

    // Build filter object for MongoDB
    const filter = {};
    if (source) filter.source = source;
    if (status) filter.status = status;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    // Fetch leads with user data
    const leads = await Lead.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    const fileName = `leads_export_${new Date().toISOString().split('T')[0]}`;

    switch (format) {
      case 'excel':
        await exportToExcel(leads, res, fileName);
        break;
      case 'pdf':
        await exportToPDF(leads, res, fileName);
        break;
      case 'csv':
        await exportToCSV(leads, res, fileName);
        break;
      default:
        return res.status(400).json({ message: 'Invalid format. Use excel, pdf, or csv' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

async function exportToExcel(leads, res, fileName) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Leads');

  // Add headers
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Service', key: 'service', width: 20 },
    { header: 'Vehicle', key: 'vehicle', width: 15 },
    { header: 'City', key: 'city', width: 15 },
    { header: 'Rental Days', key: 'rentalDays', width: 12 },
    { header: 'Rental Months', key: 'rentalMonths', width: 12 },
    { header: 'Source', key: 'source', width: 10 },
    { header: 'Campaign', key: 'campaign', width: 20 },
    { header: 'Keyword', key: 'keyword', width: 15 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Assigned To', key: 'assignedTo', width: 20 },
    { header: 'Notes', key: 'notes', width: 30 },
    { header: 'Created Date', key: 'createdAt', width: 15 },
    { header: 'Last Update', key: 'updatedAt', width: 15 }
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4F81BD' }
  };

  // Add data
  leads.forEach((lead, index) => {
    worksheet.addRow({
      id: index + 1,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      service: lead.service || '',
      vehicle: lead.vehicle || '',
      city: lead.city || '',
      rentalDays: lead.rentalDays || '',
      rentalMonths: lead.rentalMonths || '',
      source: lead.source,
      campaign: lead.campaign || '',
      keyword: lead.keyword || '',
      status: lead.status,
      assignedTo: lead.assignedTo ? lead.assignedTo.name : '',
      notes: lead.notes?.[0] || '',
      createdAt: new Date(lead.createdAt).toLocaleDateString(),
      updatedAt: lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString() : ''
    });
  });

  // Set response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
}

async function exportToPDF(leads, res, fileName) {
  const doc = new PDFDocument();
  const chunks = [];

  doc.on('data', chunk => chunks.push(chunk));
  doc.on('end', () => {
    const pdfBuffer = Buffer.concat(chunks);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.pdf`);
    res.send(pdfBuffer);
  });

  // PDF Header
  doc.fontSize(20).text('UrbanCruise - Leads Export', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
  doc.moveDown(2);

  // Table headers
  const headers = ['Name', 'Email', 'Phone', 'Source', 'Status', 'Created'];
  let yPosition = doc.y;

  headers.forEach((header, index) => {
    doc.fontSize(10).font('Helvetica-Bold').text(header, 50 + (index * 80), yPosition, { width: 70 });
  });

  doc.moveDown();

  // Table data
  leads.forEach((lead, index) => {
    if (index > 0 && index % 25 === 0) {
      doc.addPage();
      yPosition = 50;
    }

    const rowY = doc.y;
    const data = [
      lead.name,
      lead.email,
      lead.phone || 'N/A',
      lead.source,
      lead.status,
      new Date(lead.createdAt).toLocaleDateString()
    ];

    data.forEach((item, colIndex) => {
      doc.fontSize(8).font('Helvetica').text(item, 50 + (colIndex * 80), rowY, { width: 70 });
    });

    doc.moveDown();
  });

  doc.end();
}

async function exportToCSV(leads, res, fileName) {
  let csv = 'ID,Name,Email,Phone,Service,Vehicle,City,Rental Days,Rental Months,Source,Campaign,Keyword,Status,Assigned To,Notes,Created Date,Last Update\n';

  leads.forEach((lead, index) => {
    const row = [
      index + 1,
      `"${lead.name}"`,
      `"${lead.email}"`,
      `"${lead.phone || ''}"`,
      `"${lead.service || ''}"`,
      `"${lead.vehicle || ''}"`,
      `"${lead.city || ''}"`,
      `"${lead.rentalDays || ''}"`,
      `"${lead.rentalMonths || ''}"`,
      lead.source,
      `"${lead.campaign || ''}"`,
      `"${lead.keyword || ''}"`,
      lead.status,
      `"${lead.assignedTo ? lead.assignedTo.name : ''}"`,
      `"${lead.notes?.[0] || ''}"`,
      new Date(lead.createdAt).toLocaleDateString(),
      lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString() : ''
    ];
    csv += row.join(',') + '\n';
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}.csv`);
  res.send(csv);
}