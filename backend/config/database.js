const mongoose = require('mongoose');
const mysql = require('mysql2/promise');

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

// MySQL Connection Pool
const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'lms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test MySQL Connection
const testMySQLConnection = async () => {
  try {
    const connection = await mysqlPool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection error:', error);
    return false;
  }
};

// Initialize both databases
const initializeDatabases = async () => {
  try {
    await connectMongoDB();
    await testMySQLConnection();
    console.log('🎉 All database connections established');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const closeConnections = async () => {
  try {
    await mongoose.connection.close();
    await mysqlPool.end();
    console.log('🔄 Database connections closed');
  } catch (error) {
    console.error('❌ Error closing database connections:', error);
  }
};

module.exports = {
  connectMongoDB,
  mysqlPool,
  testMySQLConnection,
  initializeDatabases,
  closeConnections
};