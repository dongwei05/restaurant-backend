const OrderModel = require('../models/order');

class OrderController {
  // 创建订单
  static async createOrder(req, res) {
    try {
      const order = {
        userId: req.user.id,  // 从认证中间件获取
        ...req.body
      };
      
      const orderId = await OrderModel.createOrder(order);
      
      res.json({
        code: 0,
        data: { orderId },
        message: '下单成功'
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: error.message
      });
    }
  }

  // 获取订单列表
  static async getOrders(req, res) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const result = await OrderModel.getOrders(
        req.user.id,
        parseInt(page),
        parseInt(pageSize)
      );
      
      res.json({
        code: 0,
        data: result,
        message: 'success'
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: error.message
      });
    }
  }

  // 获取订单详情
  static async getOrderDetail(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderModel.getOrderDetail(id);
      
      if (!order) {
        return res.status(404).json({
          code: 404,
          message: '订单不存在'
        });
      }
      
      // 检查权限
      if (order.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          code: 403,
          message: '无权访问此订单'
        });
      }
      
      res.json({
        code: 0,
        data: order,
        message: 'success'
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: error.message
      });
    }
  }

  // 取消订单
  static async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderModel.getOrderDetail(id);
      
      if (!order) {
        return res.status(404).json({
          code: 404,
          message: '订单不存在'
        });
      }
      
      // 检查权限
      if (order.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          code: 403,
          message: '无权取消此订单'
        });
      }
      
      const success = await OrderModel.cancelOrder(id);
      
      if (success) {
        res.json({
          code: 0,
          message: '订单已取消'
        });
      } else {
        res.status(400).json({
          code: 400,
          message: '订单无法取消'
        });
      }
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: error.message
      });
    }
  }

  // 管理员获取订单列表
  static async getAdminOrders(req, res) {
    try {
      const { status, page = 1, pageSize = 10 } = req.query;
      const result = await OrderModel.getAdminOrders(
        status,
        parseInt(page),
        parseInt(pageSize)
      );
      
      res.json({
        code: 0,
        data: result,
        message: 'success'
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: error.message
      });
    }
  }

  // 更新订单状态
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const success = await OrderModel.updateStatus(id, status);
      
      if (success) {
        res.json({
          code: 0,
          message: '状态更新成功'
        });
      } else {
        res.status(404).json({
          code: 404,
          message: '订单不存在'
        });
      }
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: error.message
      });
    }
  }
}

module.exports = OrderController; 