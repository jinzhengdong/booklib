const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const database = require('./src/config/database');

// 导入路由
const bookRoutes = require('./src/routes/bookRoutes');
const borrowRoutes = require('./src/routes/borrowRoutes');

// 创建 Express 应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(bodyParser.json()); // 解析 JSON 请求体
app.use(bodyParser.urlencoded({ extended: true })); // 解析 URL 编码的请求体

// 请求日志中间件
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// 路由配置
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

// 根路径
app.get('/', (req, res) => {
    res.json({
        message: '图书馆管理系统 API',
        version: '1.0.0',
        endpoints: {
            books: '/api/books',
            borrow: '/api/borrow'
        }
    });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        error: '请求的资源不存在'
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        error: '服务器内部错误',
        message: err.message
    });
});

// 启动服务器
async function startServer() {
    try {
        await database.connect();
        app.listen(PORT, () => {
            console.log(`服务器运行在 http://localhost:${PORT}`);
            console.log('按 Ctrl+C 停止服务器');
        });
    } catch (error) {
        console.error('启动服务器失败:', error);
        process.exit(1);
    }
}

startServer();

// 优雅关闭
process.on('SIGINT', async () => {
    console.log('\n正在关闭服务器...');
    try {
        await database.close();
        process.exit(0);
    } catch (error) {
        console.error('关闭服务器时出错:', error);
        process.exit(1);
    }
});