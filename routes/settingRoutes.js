const express = require('express');
const router = express.Router();
const SettingController = require('../controllers/settingController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// 系统设置接口
router.get('/settings', authMiddleware, adminMiddleware, SettingController.getSettings);
router.put('/settings', authMiddleware, adminMiddleware, SettingController.updateSettings);

// 轮播图管理
router.get('/carousel', SettingController.getCarousel);
router.post('/admin/carousel', authMiddleware, adminMiddleware, upload.single('image'), SettingController.addCarousel);
router.put('/admin/carousel/:id', authMiddleware, adminMiddleware, SettingController.updateCarousel);
router.delete('/admin/carousel/:id', authMiddleware, adminMiddleware, SettingController.deleteCarousel);

// 公告管理
router.get('/announcements', SettingController.getAnnouncements);
router.post('/admin/announcements', authMiddleware, adminMiddleware, SettingController.addAnnouncement);
router.put('/admin/announcements/:id', authMiddleware, adminMiddleware, SettingController.updateAnnouncement);
router.delete('/admin/announcements/:id', authMiddleware, adminMiddleware, SettingController.deleteAnnouncement);

module.exports = router; 