const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const dishRoutes = require('./routes/dishRoutes');
// ... 其他路由导入

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 测试数据库连接
testConnection();

// 路由
app.use('/api', dishRoutes);
// ... 其他路由

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    message: '服务器内部错误'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 