const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

class UserController {
  // 用户注册
  static async register(req, res) {
    try {
      const { username, password, phone } = req.body;
      
      // 密码加密
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const userId = await UserModel.create({
        username,
        password: hashedPassword,
        phone
      });

      res.json({
        code: 0,
        data: { userId },
        message: '注册成功'
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: error.message
      });
    }
  }

  // 用户登录
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      
      // 查找用户
      const user = await UserModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({
          code: 401,
          message: '用户名或密码错误'
        });
      }

      // 验证密码
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          code: 401,
          message: '用户名或密码错误'
        });
      }

      // 生成 token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        code: 0,
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        },
        message: '登录成功'
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: error.message
      });
    }
  }
}

module.exports = UserController; 