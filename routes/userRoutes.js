const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// 公开接口
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// 需要认证的接口
router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile', authMiddleware, UserController.updateProfile);

// 管理员接口
router.get('/admin/users', authMiddleware, adminMiddleware, UserController.getUsers);
router.post('/admin/users', authMiddleware, adminMiddleware, UserController.createUser);
router.put('/admin/users/:id', authMiddleware, adminMiddleware, UserController.updateUser);
router.delete('/admin/users/:id', authMiddleware, adminMiddleware, UserController.deleteUser);

module.exports = router; 