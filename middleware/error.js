const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // 数据库错误
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      code: 400,
      message: '数据已存在'
    });
  }

  // JWT错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      code: 401,
      message: '无效的认证令牌'
    });
  }

  // 默认错误响应
  res.status(500).json({
    code: 500,
    message: '服务器内部错误'
  });
};

module.exports = errorHandler; 