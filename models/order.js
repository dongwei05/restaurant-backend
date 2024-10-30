const { pool } = require('../config/database');

class OrderModel {
  // 创建订单
  static async createOrder(order) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      
      // 插入订单主表
      const [orderResult] = await conn.query(
        `INSERT INTO orders (orderNumber, userId, total, status)
         VALUES (?, ?, ?, 'pending')`,
        [this.generateOrderNumber(), order.userId, order.total]
      );
      
      const orderId = orderResult.insertId;
      
      // 插入订单详情
      for (const item of order.items) {
        await conn.query(
          `INSERT INTO order_items (orderId, dishId, quantity, price)
           VALUES (?, ?, ?, ?)`,
          [orderId, item.id, item.quantity, item.price]
        );
      }
      
      await conn.commit();
      return orderId;
      
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  // 获取订单列表
  static async getOrders(userId, page = 1, pageSize = 10) {
    try {
      // 获取总数
      const [countResult] = await pool.query(
        'SELECT COUNT(*) as total FROM orders WHERE userId = ?',
        [userId]
      );
      
      // 获取订单列表
      const [orders] = await pool.query(
        `SELECT o.*, 
                GROUP_CONCAT(
                  JSON_OBJECT(
                    'id', oi.dishId,
                    'name', d.name,
                    'price', oi.price,
                    'quantity', oi.quantity
                  )
                ) as items
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.orderId
         LEFT JOIN dishes d ON oi.dishId = d.id
         WHERE o.userId = ?
         GROUP BY o.id
         ORDER BY o.createTime DESC
         LIMIT ? OFFSET ?`,
        [userId, pageSize, (page - 1) * pageSize]
      );
      
      // 处理订单项
      orders.forEach(order => {
        order.items = order.items ? JSON.parse(`[${order.items}]`) : [];
      });
      
      return {
        total: countResult[0].total,
        orders
      };
      
    } catch (error) {
      throw error;
    }
  }

  // 获取订单详情
  static async getOrderDetail(orderId) {
    try {
      const [orders] = await pool.query(
        `SELECT o.*,
                JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'id', oi.dishId,
                    'name', d.name,
                    'price', oi.price,
                    'quantity', oi.quantity
                  )
                ) as items
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.orderId
         LEFT JOIN dishes d ON oi.dishId = d.id
         WHERE o.id = ?
         GROUP BY o.id`,
        [orderId]
      );
      
      if (orders.length === 0) {
        return null;
      }
      
      const order = orders[0];
      order.items = JSON.parse(order.items);
      return order;
      
    } catch (error) {
      throw error;
    }
  }

  // 更新订单状态
  static async updateStatus(orderId, status) {
    try {
      const [result] = await pool.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 取消订单
  static async cancelOrder(orderId) {
    try {
      const [result] = await pool.query(
        `UPDATE orders SET status = 'cancelled' WHERE id = ? AND status = 'pending'`,
        [orderId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 生成订单号
  static generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${year}${month}${day}${random}`;
  }

  // 获取管理员订单列表
  static async getAdminOrders(status = null, page = 1, pageSize = 10) {
    try {
      let whereClause = '';
      let params = [];
      
      if (status) {
        whereClause = 'WHERE o.status = ?';
        params.push(status);
      }
      
      // 获取总数
      const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM orders o ${whereClause}`,
        params
      );
      
      // 获取订单列表
      params.push(pageSize, (page - 1) * pageSize);
      const [orders] = await pool.query(
        `SELECT o.*, u.username, u.phone,
                GROUP_CONCAT(
                  JSON_OBJECT(
                    'id', oi.dishId,
                    'name', d.name,
                    'price', oi.price,
                    'quantity', oi.quantity
                  )
                ) as items
         FROM orders o
         LEFT JOIN users u ON o.userId = u.id
         LEFT JOIN order_items oi ON o.id = oi.orderId
         LEFT JOIN dishes d ON oi.dishId = d.id
         ${whereClause}
         GROUP BY o.id
         ORDER BY o.createTime DESC
         LIMIT ? OFFSET ?`,
        params
      );
      
      // 处理订单项
      orders.forEach(order => {
        order.items = order.items ? JSON.parse(`[${order.items}]`) : [];
      });
      
      return {
        total: countResult[0].total,
        orders
      };
      
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrderModel; 