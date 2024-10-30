const { pool } = require('../config/database');

class SettingModel {
    // 获取系统设置
    static async getSettings() {
        try {
            const [rows] = await pool.query('SELECT * FROM settings');
            return rows[0] || {};
        } catch (error) {
            throw error;
        }
    }

    // 更新系统设置
    static async updateSettings(settings) {
        try {
            const [result] = await pool.query(
                'UPDATE settings SET ? WHERE id = 1',
                [settings]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // 获取轮播图
    static async getCarousel() {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM carousel WHERE status = "active" ORDER BY sort'
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // 获取公告
    static async getAnnouncements() {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM announcements WHERE status = "active" ORDER BY createTime DESC'
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = SettingModel; 