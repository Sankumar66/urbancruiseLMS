const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  setting_key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  setting_value: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  setting_type: {
    type: DataTypes.ENUM('string', 'number', 'boolean', 'json'),
    defaultValue: 'string',
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
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

// Pre-populate default settings
const defaultSettings = [
  { setting_key: 'meta_app_id', setting_value: '', setting_type: 'string', description: 'Meta App ID for API integration' },
  { setting_key: 'meta_app_secret', setting_value: '', setting_type: 'string', description: 'Meta App Secret for API integration' },
  { setting_key: 'meta_access_token', setting_value: '', setting_type: 'string', description: 'Meta Access Token for API calls' },
  { setting_key: 'google_client_id', setting_value: '', setting_type: 'string', description: 'Google Ads Client ID' },
  { setting_key: 'google_client_secret', setting_value: '', setting_type: 'string', description: 'Google Ads Client Secret' },
  { setting_key: 'google_refresh_token', setting_value: '', setting_type: 'string', description: 'Google Ads Refresh Token' },
  { setting_key: 'google_developer_token', setting_value: '', setting_type: 'string', description: 'Google Ads Developer Token' },
  { setting_key: 'email_user', setting_value: '', setting_type: 'string', description: 'Email service username' },
  { setting_key: 'email_pass', setting_value: '', setting_type: 'string', description: 'Email service password' },
  { setting_key: 'twilio_sid', setting_value: '', setting_type: 'string', description: 'Twilio Account SID' },
  { setting_key: 'twilio_auth_token', setting_value: '', setting_type: 'string', description: 'Twilio Auth Token' },
  { setting_key: 'twilio_phone_number', setting_value: '', setting_type: 'string', description: 'Twilio Phone Number' },
  { setting_key: 'notification_email', setting_value: 'admin@urbancruise.com', setting_type: 'string', description: 'Admin notification email' },
  { setting_key: 'sync_interval', setting_value: '60', setting_type: 'number', description: 'Sync interval in minutes' },
  { setting_key: 'auto_sync_enabled', setting_value: 'true', setting_type: 'boolean', description: 'Enable automatic lead synchronization' },
];

Setting.afterSync(async () => {
  try {
    for (const setting of defaultSettings) {
      await Setting.findOrCreate({
        where: { setting_key: setting.setting_key },
        defaults: setting,
      });
    }
  } catch (error) {
    console.error('Error creating default settings:', error);
  }
});

module.exports = Setting;