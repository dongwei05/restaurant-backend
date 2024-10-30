const DishModel = require('../models/dish');

class DishController {
  // 获取菜品列表
  static async getDishes(req, res) {
    try {
      const { categoryId } = req.query;
      let dishes;
      
      if (categoryId) {
        dishes = await DishModel.getDishesByCategory(categoryId);
      } else {
        dishes = await DishModel.getAllDishes();
      }
      
      res.json({
        code: 0,
        data: dishes,
        message: 'success'
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: error.message
      });
    }
  }

  // 添加菜品
  static async addDish(req, res) {
    try {
      const dish = req.body;
      const id = await DishModel.addDish(dish);
      
      res.json({
        code: 0,
        data: { id },
        message: '添加成功'
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: error.message
      });
    }
  }

  // 更新菜品
  static async updateDish(req, res) {
    try {
      const { id } = req.params;
      const dish = req.body;
      const success = await DishModel.updateDish(id, dish);
      
      if (success) {
        res.json({
          code: 0,
          message: '更新成功'
        });
      } else {
        res.status(404).json({
          code: 404,
          message: '菜品不存在'
        });
      }
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: error.message
      });
    }
  }

  // 删除菜品
  static async deleteDish(req, res) {
    try {
      const { id } = req.params;
      const success = await DishModel.deleteDish(id);
      
      if (success) {
        res.json({
          code: 0,
          message: '删除成功'
        });
      } else {
        res.status(404).json({
          code: 404,
          message: '菜品不存在'
        });
      }
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: error.message
      });
    }
  }

  // 更新菜品状态
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const success = await DishModel.updateStatus(id, status);
      
      if (success) {
        res.json({
          code: 0,
          message: '状态更新成功'
        });
      } else {
        res.status(404).json({
          code: 404,
          message: '菜品不存在'
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

module.exports = DishController; 