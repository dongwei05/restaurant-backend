const express = require('express');
const router = express.Router();
const DishController = require('../controllers/dishController');
const { authMiddleware } = require('../middleware/auth');

// 公开接口
router.get('/dishes', DishController.getDishes);

// 需要认证的接口
router.post('/admin/dishes', authMiddleware, DishController.addDish);
router.put('/admin/dishes/:id', authMiddleware, DishController.updateDish);
router.delete('/admin/dishes/:id', authMiddleware, DishController.deleteDish);
router.patch('/admin/dishes/:id/status', authMiddleware, DishController.updateStatus);

module.exports = router; 