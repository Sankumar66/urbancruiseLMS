const ActivityLog = require('../models/ActivityLog');

exports.logActivity = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      action,
      entityType,
      entityId,
      description,
      ipAddress,
      userAgent,
      oldData,
      newData,
      metadata
    } = req.body;

    const activityLog = new ActivityLog({
      userId,
      userName,
      userEmail,
      action,
      entityType,
      entityId,
      description,
      ipAddress,
      userAgent,
      oldData,
      newData,
      metadata
    });

    await activityLog.save();

    res.status(201).json({
      success: true,
      message: 'Activity logged successfully',
      data: activityLog,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Log activity error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to log activity',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

exports.getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, action, entityType, dateFrom, dateTo } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (action) filter.action = action;
    if (entityType) filter.entityType = entityType;

    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const activityLogs = await ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ActivityLog.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        activityLogs,
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
    console.error('Get activity logs error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity logs',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

exports.getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const activityLogs = await ActivityLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ActivityLog.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: {
        activityLogs,
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
    console.error('Get user activity error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user activity',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const activityLogs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name email');

    res.status(200).json({
      success: true,
      data: activityLogs,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Get recent activity error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent activity',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
};