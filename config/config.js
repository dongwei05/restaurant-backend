require('dotenv').config();

const config = {
    // 服务器配置
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development',
        corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8080'
    },

    // 数据库配置
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'restaurant_user',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'restaurant_db',
        connectionLimit: 10
    },

    // JWT配置
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },

    // 文件上传配置
    upload: {
        directory: process.env.UPLOAD_DIR || 'uploads',
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
        limits: {
            files: 1,  // 单次上传文件数量
            fileSize: 5 * 1024 * 1024  // 单个文件大小限制
        }
    },

    // 日志配置
    logger: {
        level: process.env.LOG_LEVEL || 'info',
        directory: process.env.LOG_DIR || 'logs',
        maxFiles: '14d',  // 保留14天的日志
        maxSize: '20m'    // 单个日志文件最大20MB
    },

    // 缓存配置
    cache: {
        ttl: 60 * 60,  // 1小时
        checkPeriod: 60  // 检查过期缓存的周期（秒）
    },

    // 安全配置
    security: {
        bcryptRounds: 10,  // 密码加密轮数
        rateLimit: {
            windowMs: 15 * 60 * 1000,  // 15分钟
            max: 100  // 限制每个IP 100次请求
        },
        cors: {
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }
    },

    // 业务配置
    business: {
        orderPrefix: 'ORD',  // 订单号前缀
        pageSize: 10,  // 默认分页大小
        maxPageSize: 100,  // 最大分页大小
        orderStatuses: ['pending', 'processing', 'completed', 'cancelled'],
        userRoles: ['user', 'admin']
    },

    // 第三方服务配置
    services: {
        sms: {
            provider: process.env.SMS_PROVIDER,
            apiKey: process.env.SMS_API_KEY,
            templateId: process.env.SMS_TEMPLATE_ID
        },
        email: {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    },

    // 开发工具配置
    development: {
        swagger: {
            enabled: process.env.NODE_ENV !== 'production',
            title: '餐厅点餐系统 API 文档',
            version: '1.0.0',
            basePath: '/api'
        }
    }
};

// 环境特定配置
const envConfig = {
    development: {
        server: {
            cors: true,
            morgan: 'dev'
        }
    },
    production: {
        server: {
            cors: false,
            morgan: 'combined'
        }
    }
};

// 合并环境配置
const env = process.env.NODE_ENV || 'development';
Object.assign(config, envConfig[env] || {});

// 验证必要的配置项
const requiredEnvVars = ['DB_PASSWORD', 'JWT_SECRET'];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`必须设置环境变量: ${varName}`);
    }
});

module.exports = config; 