const SettingModel = require('../models/setting');

class SettingController {
    // 获取系统设置
    static async getSettings(req, res) {
        try {
            const settings = await SettingModel.getSettings();
            res.json({
                code: 0,
                data: settings,
                message: 'success'
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error.message
            });
        }
    }

    // 更新系统设置
    static async updateSettings(req, res) {
        try {
            const settings = req.body;
            await SettingModel.updateSettings(settings);
            res.json({
                code: 0,
                message: '设置更新成功'
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error.message
            });
        }
    }

    // 轮播图相关方法
    static async getCarousel(req, res) {
        try {
            const carousel = await SettingModel.getCarousel();
            res.json({
                code: 0,
                data: carousel,
                message: 'success'
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error.message
            });
        }
    }

    // 公告相关方法
    static async getAnnouncements(req, res) {
        try {
            const announcements = await SettingModel.getAnnouncements();
            res.json({
                code: 0,
                data: announcements,
                message: 'success'
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error.message
            });
        }
    }
}

module.exports = SettingController; 