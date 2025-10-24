const { mysqlPool } = require('../config/database');

class MySQLLead {
  static async create(leadData) {
    const connection = await mysqlPool.getConnection();
    try {
      const [result] = await connection.execute(
        `INSERT INTO leads (
          name, email, phone, service, vehicle, city,
          rental_days, rental_months, source, campaign,
          keyword, status, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          leadData.name,
          leadData.email,
          leadData.phone,
          leadData.service,
          leadData.vehicle,
          leadData.city,
          leadData.rentalDays,
          leadData.rentalMonths,
          leadData.source,
          leadData.campaign,
          leadData.keyword,
          leadData.status,
          leadData.notes ? leadData.notes.join(', ') : null
        ]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  static async findAll(options = {}) {
    const connection = await mysqlPool.getConnection();
    try {
      let query = 'SELECT * FROM leads WHERE 1=1';
      const params = [];

      if (options.source) {
        query += ' AND source = ?';
        params.push(options.source);
      }

      if (options.status) {
        query += ' AND status = ?';
        params.push(options.status);
      }

      if (options.email) {
        query += ' AND email = ?';
        params.push(options.email);
      }

      query += ' ORDER BY created_at DESC';

      if (options.limit) {
        query += ' LIMIT ?';
        params.push(options.limit);
      }

      if (options.offset) {
        query += ' OFFSET ?';
        params.push(options.offset);
      }

      const [rows] = await connection.execute(query, params);
      return rows;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const connection = await mysqlPool.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM leads WHERE id = ?', [id]);
      return rows[0];
    } finally {
      connection.release();
    }
  }

  static async update(id, updateData) {
    const connection = await mysqlPool.getConnection();
    try {
      const fields = [];
      const values = [];

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });

      if (fields.length === 0) return;

      values.push(id);
      const query = `UPDATE leads SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;

      await connection.execute(query, values);
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const connection = await mysqlPool.getConnection();
    try {
      await connection.execute('DELETE FROM leads WHERE id = ?', [id]);
    } finally {
      connection.release();
    }
  }

  static async count(options = {}) {
    const connection = await mysqlPool.getConnection();
    try {
      let query = 'SELECT COUNT(*) as count FROM leads WHERE 1=1';
      const params = [];

      if (options.source) {
        query += ' AND source = ?';
        params.push(options.source);
      }

      if (options.status) {
        query += ' AND status = ?';
        params.push(options.status);
      }

      const [rows] = await connection.execute(query, params);
      return rows[0].count;
    } finally {
      connection.release();
    }
  }
}

module.exports = MySQLLead;