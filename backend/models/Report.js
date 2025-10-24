const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  total_leads: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  converted_leads: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  new_leads: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  website_leads: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  meta_leads: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  google_leads: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  conversion_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  report_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Report;