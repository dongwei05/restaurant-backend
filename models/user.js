const { pool } = require('../config/database');

class UserModel {
  static async create(user) {
    try {
      const [result] = await pool.query(
        `INSERT INTO users (username, password, phone, role)
         VALUES (?, ?, ?, 'user')`,
        [user.username, user.password, user.phone]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByUsername(username) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel; 