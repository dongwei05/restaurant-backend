const { pool } = require('../config/database');

class DishModel {
  // 获取所有菜品
  static async getAllDishes() {
    try {
      const [rows] = await pool.query(`
        SELECT d.*, c.name as categoryName 
        FROM dishes d
        LEFT JOIN categories c ON d.categoryId = c.id
        WHERE d.status = 'active'
        ORDER BY d.sort
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // 根据分类获取菜品
  static async getDishesByCategory(categoryId) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM dishes WHERE categoryId = ? AND status = 'active'`,
        [categoryId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // 添加菜品
  static async addDish(dish) {
    try {
      const [result] = await pool.query(
        `INSERT INTO dishes (name, categoryId, price, description, imageUrl, status, sort)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [dish.name, dish.categoryId, dish.price, dish.description, 
         dish.imageUrl, dish.status || 'active', dish.sort || 0]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // 更新菜品
  static async updateDish(id, dish) {
    try {
      const [result] = await pool.query(
        `UPDATE dishes 
         SET name = ?, categoryId = ?, price = ?, description = ?, 
             imageUrl = ?, status = ?, sort = ?
         WHERE id = ?`,
        [dish.name, dish.categoryId, dish.price, dish.description,
         dish.imageUrl, dish.status, dish.sort, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 删除菜品
  static async deleteDish(id) {
    try {
      const [result] = await pool.query(
        'UPDATE dishes SET status = "deleted" WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 更新菜品状态
  static async updateStatus(id, status) {
    try {
      const [result] = await pool.query(
        'UPDATE dishes SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DishModel; 