const MySQLLead = require('../models/mysql/Leads');

exports.getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, source, status, assignedTo } = req.query;
    const offset = (page - 1) * limit;

    const options = {};
    if (source) options.source = source;
    if (status) options.status = status;

    const leads = await MySQLLead.findAll({
      ...options,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const total = await MySQLLead.count(options);

    // Transform MySQL data to match frontend expectations
    const transformedLeads = leads.map(lead => ({
      _id: lead.id.toString(),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      service: lead.service,
      vehicle: lead.vehicle,
      city: lead.city,
      rentalDays: lead.rental_days,
      rentalMonths: lead.rental_months,
      source: lead.source,
      campaign: lead.campaign,
      keyword: lead.keyword,
      status: lead.status,
      notes: lead.notes ? [lead.notes] : [],
      createdAt: lead.created_at,
      updatedAt: lead.updated_at
    }));

    res.status(200).json({
      success: true,
      data: {
        leads: transformedLeads,
        pagination: {
          totalPages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Get leads error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leads',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email');
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found',
        message: `No lead found with ID: ${req.params.id}`,
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Get lead error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lead',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

exports.createLead = async (req, res) => {
  try {
    // Validate required fields
    const { name, email, source } = req.body;
    if (!name || !email || !source) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Name, email, and source are required fields',
        timestamp: new Date().toISOString()
      });
    }

    // Check for duplicate email or phone
    const existingLead = await Lead.findOne({
      $or: [
        { email: email },
        ...(req.body.phone ? [{ phone: req.body.phone }] : [])
      ]
    });

    if (existingLead) {
      return res.status(409).json({
        success: false,
        error: 'Duplicate entry',
        message: `Lead with this ${existingLead.email === email ? 'email' : 'phone number'} already exists`,
        existingLead: {
          id: existingLead._id,
          name: existingLead.name,
          email: existingLead.email,
          phone: existingLead.phone
        },
        timestamp: new Date().toISOString()
      });
    }

    const lead = new Lead(req.body);
    await lead.save();

    // Log the create activity
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({
      userId: req.user?.id || 'system',
      userName: req.user?.name || 'System',
      userEmail: req.user?.email || 'system@urbancruise.com',
      action: 'CREATE_LEAD',
      entityType: 'LEAD',
      entityId: lead._id,
      description: `Created new lead: ${lead.name} (${lead.email})`,
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      newData: lead,
      metadata: { source: lead.source }
    });

    res.status(201).json({
      success: true,
      data: lead,
      message: 'Lead created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Create lead error:', err);
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Duplicate entry',
        message: 'Lead with this email already exists',
        timestamp: new Date().toISOString()
      });
    }
    res.status(400).json({
      success: false,
      error: 'Failed to create lead',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

exports.updateLead = async (req, res) => {
  try {
    // Get the old lead data for logging
    const oldLead = await Lead.findById(req.params.id);

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found',
        message: `No lead found with ID: ${req.params.id}`,
        timestamp: new Date().toISOString()
      });
    }

    // Log the update activity
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({
      userId: req.user?.id || 'system',
      userName: req.user?.name || 'System',
      userEmail: req.user?.email || 'system@urbancruise.com',
      action: 'UPDATE_LEAD',
      entityType: 'LEAD',
      entityId: req.params.id,
      description: `Updated lead: ${lead.name} (${lead.email})`,
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      oldData: oldLead,
      newData: lead,
      metadata: { changes: req.body }
    });

    res.status(200).json({
      success: true,
      data: lead,
      message: 'Lead updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Update lead error:', err);
    res.status(400).json({
      success: false,
      error: 'Failed to update lead',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found',
        message: `No lead found with ID: ${req.params.id}`,
        timestamp: new Date().toISOString()
      });
    }

    // Log the delete activity
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({
      userId: req.user?.id || 'system',
      userName: req.user?.name || 'System',
      userEmail: req.user?.email || 'system@urbancruise.com',
      action: 'DELETE_LEAD',
      entityType: 'LEAD',
      entityId: req.params.id,
      description: `Deleted lead: ${lead.name} (${lead.email})`,
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      oldData: lead,
      metadata: { source: lead.source, status: lead.status }
    });

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: { deletedLead: lead },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Delete lead error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete lead',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

exports.assignLead = async (req, res) => {
  try {
    const { leadId, userId } = req.body;

    if (!leadId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Lead ID and User ID are required',
        timestamp: new Date().toISOString()
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      leadId,
      {
        assignedTo: userId,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found',
        message: `No lead found with ID: ${leadId}`,
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
      message: 'Lead assigned successfully',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Assign lead error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to assign lead',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

exports.filterLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      source,
      status,
      assignedTo,
      dateFrom,
      dateTo,
      search
    } = req.query;

    const filter = {};

    // Basic filters
    if (source) filter.source = source;
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;

    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { service: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filter)
      .populate('assignedTo', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Lead.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        leads,
        pagination: {
          totalPages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Filter leads error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to filter leads',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
};