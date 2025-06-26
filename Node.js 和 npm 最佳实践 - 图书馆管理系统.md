## 一、项目概述

本教程通过构建一个前后端分离的图书馆管理系统，介绍 Node.js 和 npm 的开发最佳实践。该系统采用 Node.js 作为后端服务器，SQLite3 作为数据库，Layui 作为前端框架，jQuery 处理前后端交互。本教程的核心目标是让学生掌握使用 VS Code 开发前后端分离项目的完整流程。

### 技术栈说明

后端技术栈包括 Node.js 运行环境、Express 框架用于构建 RESTful API、SQLite3 作为轻量级数据库、cors 中间件处理跨域请求。前端技术栈包括 Layui 2.x UI 框架、jQuery 3.x 处理 AJAX 请求、原生 HTML5 和 CSS3。开发工具使用 Visual Studio Code，配合 npm 进行包管理。

## 二、项目初始化与环境配置

### 创建项目结构

首先在 VS Code 中创建项目的基本目录结构。良好的项目结构是项目可维护性的基础。

```
library-management-system/
├── backend/                 # 后端代码目录
│   ├── src/                # 源代码目录
│   │   ├── config/         # 配置文件
│   │   ├── controllers/    # 控制器
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由定义
│   │   └── utils/          # 工具函数
│   ├── database/           # 数据库文件
│   ├── package.json        # 后端依赖配置
│   └── server.js           # 服务器入口文件
├── frontend/               # 前端代码目录
│   ├── css/               # 样式文件
│   ├── js/                # JavaScript 文件
│   ├── lib/               # 第三方库（Layui、jQuery）
│   └── index.html         # 主页面
└── README.md              # 项目说明文档
```

### 初始化后端项目

在 VS Code 终端中，进入 backend 目录并初始化 npm 项目。npm init 命令会引导创建 package.json 文件，这是 Node.js 项目的核心配置文件。

```bash
cd backend
npm init -y
```

修改生成的 package.json 文件，添加项目的基本信息和脚本命令：

```json
{
  "name": "library-backend",
  "version": "1.0.0",
  "description": "图书馆管理系统后端服务",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["library", "management", "nodejs", "sqlite"],
  "author": "Your Name",
  "license": "MIT"
}
```

### 安装后端依赖

使用 npm 安装项目所需的依赖包。理解 dependencies 和 devDependencies 的区别对于项目管理至关重要。

```bash
# 安装生产环境依赖
npm install express sqlite3 cors body-parser

# 安装开发环境依赖
npm install --save-dev nodemon
```

依赖说明：express 是 Node.js 最流行的 Web 框架，提供了构建 Web 应用的基础功能。sqlite3 是 SQLite 数据库的 Node.js 驱动。cors 中间件解决跨域资源共享问题。body-parser 用于解析 HTTP 请求体。nodemon 是开发工具，可以监视文件变化并自动重启服务器。

## 三、数据库设计与初始化

### 创建数据库架构

在 backend/database 目录下创建 init.js 文件，用于初始化数据库结构：

```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 创建数据库连接
const db = new sqlite3.Database(path.join(__dirname, 'booklibrary.db'), (err) => {
    if (err) {
        console.error('数据库连接失败:', err.message);
    } else {
        console.log('成功连接到 SQLite 数据库');
    }
});

// 创建图书表
const createBooksTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            isbn VARCHAR(20) UNIQUE NOT NULL,
            title VARCHAR(200) NOT NULL,
            author VARCHAR(100) NOT NULL,
            publisher VARCHAR(100),
            publish_date DATE,
            category VARCHAR(50),
            status VARCHAR(20) DEFAULT 'available',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.run(sql, (err) => {
        if (err) {
            console.error('创建图书表失败:', err.message);
        } else {
            console.log('图书表创建成功');
        }
    });
};

// 创建借阅记录表
const createBorrowRecordsTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS borrow_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER NOT NULL,
            borrower_name VARCHAR(50) NOT NULL,
            borrower_phone VARCHAR(20) NOT NULL,
            borrow_date DATE DEFAULT CURRENT_DATE,
            return_date DATE,
            status VARCHAR(20) DEFAULT 'borrowing',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (book_id) REFERENCES books (id)
        )
    `;
    
    db.run(sql, (err) => {
        if (err) {
            console.error('创建借阅记录表失败:', err.message);
        } else {
            console.log('借阅记录表创建成功');
        }
    });
};

// 插入示例数据
const insertSampleData = () => {
    const books = [
        {
            isbn: '9787115428028',
            title: 'JavaScript高级程序设计',
            author: 'Nicholas C. Zakas',
            publisher: '人民邮电出版社',
            publish_date: '2017-09-01',
            category: '编程'
        },
        {
            isbn: '9787121362217',
            title: 'Node.js实战',
            author: 'Mike Cantelon',
            publisher: '电子工业出版社',
            publish_date: '2019-05-01',
            category: '编程'
        },
        {
            isbn: '9787115485588',
            title: '深入浅出Node.js',
            author: '朴灵',
            publisher: '人民邮电出版社',
            publish_date: '2018-12-01',
            category: '编程'
        }
    ];
    
    const insertBook = db.prepare(`
        INSERT OR IGNORE INTO books (isbn, title, author, publisher, publish_date, category)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    books.forEach(book => {
        insertBook.run(
            book.isbn,
            book.title,
            book.author,
            book.publisher,
            book.publish_date,
            book.category
        );
    });
    
    insertBook.finalize();
    console.log('示例数据插入完成');
};

// 执行数据库初始化
db.serialize(() => {
    createBooksTable();
    createBorrowRecordsTable();
    insertSampleData();
});

// 关闭数据库连接
db.close((err) => {
    if (err) {
        console.error('关闭数据库失败:', err.message);
    } else {
        console.log('数据库连接已关闭');
    }
});
```

运行初始化脚本：

```bash
node database/init.js
```

### 创建数据库连接模块

创建 backend/src/config/database.js，封装数据库连接逻辑：

```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = null;
    }
    
    connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(
                path.join(__dirname, '../../database/booklibrary.db'),
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('数据库连接成功');
                        resolve(this.db);
                    }
                }
            );
        });
    }
    
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }
    
    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('数据库连接已关闭');
                    resolve();
                }
            });
        });
    }
}

module.exports = new Database();
```

## 四、后端 API 开发

### 创建服务器入口文件

创建 backend/server.js 文件，这是后端服务的主入口：

```javascript
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
```

### 创建图书管理控制器

创建 backend/src/controllers/bookController.js：

```javascript
const database = require('../config/database');

class BookController {
    // 获取所有图书
    async getAllBooks(req, res) {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            const offset = (page - 1) * limit;
            
            let sql = 'SELECT * FROM books';
            let countSql = 'SELECT COUNT(*) as total FROM books';
            const params = [];
            
            if (search) {
                sql += ' WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ?';
                countSql += ' WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ?';
                const searchPattern = `%${search}%`;
                params.push(searchPattern, searchPattern, searchPattern);
            }
            
            sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
            
            const books = await database.all(sql, [...params, parseInt(limit), parseInt(offset)]);
            const { total } = await database.get(countSql, params);
            
            res.json({
                code: 0,
                msg: 'success',
                data: books,
                count: total,
                page: parseInt(page),
                limit: parseInt(limit)
            });
        } catch (error) {
            console.error('获取图书列表失败:', error);
            res.status(500).json({
                code: -1,
                msg: '获取图书列表失败',
                error: error.message
            });
        }
    }
    
    // 获取单本图书
    async getBookById(req, res) {
        try {
            const { id } = req.params;
            const book = await database.get('SELECT * FROM books WHERE id = ?', [id]);
            
            if (!book) {
                return res.status(404).json({
                    code: -1,
                    msg: '图书不存在'
                });
            }
            
            res.json({
                code: 0,
                msg: 'success',
                data: book
            });
        } catch (error) {
            console.error('获取图书详情失败:', error);
            res.status(500).json({
                code: -1,
                msg: '获取图书详情失败',
                error: error.message
            });
        }
    }
    
    // 添加图书
    async createBook(req, res) {
        try {
            const { isbn, title, author, publisher, publish_date, category } = req.body;
            
            // 验证必填字段
            if (!isbn || !title || !author) {
                return res.status(400).json({
                    code: -1,
                    msg: 'ISBN、书名和作者为必填项'
                });
            }
            
            // 检查ISBN是否已存在
            const existing = await database.get('SELECT id FROM books WHERE isbn = ?', [isbn]);
            if (existing) {
                return res.status(400).json({
                    code: -1,
                    msg: '该ISBN已存在'
                });
            }
            
            const sql = `
                INSERT INTO books (isbn, title, author, publisher, publish_date, category)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            const result = await database.run(sql, [isbn, title, author, publisher, publish_date, category]);
            
            res.status(201).json({
                code: 0,
                msg: '图书添加成功',
                data: { id: result.id }
            });
        } catch (error) {
            console.error('添加图书失败:', error);
            res.status(500).json({
                code: -1,
                msg: '添加图书失败',
                error: error.message
            });
        }
    }
    
    // 更新图书信息
    async updateBook(req, res) {
        try {
            const { id } = req.params;
            const { title, author, publisher, publish_date, category } = req.body;
            
            // 检查图书是否存在
            const book = await database.get('SELECT id FROM books WHERE id = ?', [id]);
            if (!book) {
                return res.status(404).json({
                    code: -1,
                    msg: '图书不存在'
                });
            }
            
            const sql = `
                UPDATE books 
                SET title = ?, author = ?, publisher = ?, publish_date = ?, category = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            
            await database.run(sql, [title, author, publisher, publish_date, category, id]);
            
            res.json({
                code: 0,
                msg: '图书信息更新成功'
            });
        } catch (error) {
            console.error('更新图书失败:', error);
            res.status(500).json({
                code: -1,
                msg: '更新图书失败',
                error: error.message
            });
        }
    }
    
    // 删除图书
    async deleteBook(req, res) {
        try {
            const { id } = req.params;
            
            // 检查是否有未归还的借阅记录
            const borrowing = await database.get(
                'SELECT id FROM borrow_records WHERE book_id = ? AND status = "borrowing"',
                [id]
            );
            
            if (borrowing) {
                return res.status(400).json({
                    code: -1,
                    msg: '该图书有未归还的借阅记录，无法删除'
                });
            }
            
            await database.run('DELETE FROM books WHERE id = ?', [id]);
            
            res.json({
                code: 0,
                msg: '图书删除成功'
            });
        } catch (error) {
            console.error('删除图书失败:', error);
            res.status(500).json({
                code: -1,
                msg: '删除图书失败',
                error: error.message
            });
        }
    }
}

module.exports = new BookController();
```

### 创建图书路由

创建 backend/src/routes/bookRoutes.js：

```javascript
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// 图书相关路由
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', bookController.createBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;
```

### 创建借阅管理控制器

创建 backend/src/controllers/borrowController.js：

```javascript
const database = require('../config/database');

class BorrowController {
    // 借阅图书
    async borrowBook(req, res) {
        try {
            const { book_id, borrower_name, borrower_phone } = req.body;
            
            // 验证必填字段
            if (!book_id || !borrower_name || !borrower_phone) {
                return res.status(400).json({
                    code: -1,
                    msg: '图书ID、借阅人姓名和电话为必填项'
                });
            }
            
            // 检查图书是否存在且可借
            const book = await database.get(
                'SELECT id, status FROM books WHERE id = ?',
                [book_id]
            );
            
            if (!book) {
                return res.status(404).json({
                    code: -1,
                    msg: '图书不存在'
                });
            }
            
            if (book.status !== 'available') {
                return res.status(400).json({
                    code: -1,
                    msg: '图书已被借出'
                });
            }
            
            // 开始事务
            await database.run('BEGIN TRANSACTION');
            
            try {
                // 创建借阅记录
                const insertSql = `
                    INSERT INTO borrow_records (book_id, borrower_name, borrower_phone)
                    VALUES (?, ?, ?)
                `;
                const result = await database.run(insertSql, [book_id, borrower_name, borrower_phone]);
                
                // 更新图书状态
                await database.run(
                    'UPDATE books SET status = "borrowed" WHERE id = ?',
                    [book_id]
                );
                
                await database.run('COMMIT');
                
                res.status(201).json({
                    code: 0,
                    msg: '借阅成功',
                    data: { id: result.id }
                });
            } catch (error) {
                await database.run('ROLLBACK');
                throw error;
            }
        } catch (error) {
            console.error('借阅图书失败:', error);
            res.status(500).json({
                code: -1,
                msg: '借阅图书失败',
                error: error.message
            });
        }
    }
    
    // 归还图书
    async returnBook(req, res) {
        try {
            const { id } = req.params;
            
            // 检查借阅记录
            const record = await database.get(
                'SELECT * FROM borrow_records WHERE id = ? AND status = "borrowing"',
                [id]
            );
            
            if (!record) {
                return res.status(404).json({
                    code: -1,
                    msg: '借阅记录不存在或已归还'
                });
            }
            
            // 开始事务
            await database.run('BEGIN TRANSACTION');
            
            try {
                // 更新借阅记录
                await database.run(
                    'UPDATE borrow_records SET status = "returned", return_date = CURRENT_DATE WHERE id = ?',
                    [id]
                );
                
                // 更新图书状态
                await database.run(
                    'UPDATE books SET status = "available" WHERE id = ?',
                    [record.book_id]
                );
                
                await database.run('COMMIT');
                
                res.json({
                    code: 0,
                    msg: '归还成功'
                });
            } catch (error) {
                await database.run('ROLLBACK');
                throw error;
            }
        } catch (error) {
            console.error('归还图书失败:', error);
            res.status(500).json({
                code: -1,
                msg: '归还图书失败',
                error: error.message
            });
        }
    }
    
    // 获取借阅记录
    async getBorrowRecords(req, res) {
        try {
            const { page = 1, limit = 10, status } = req.query;
            const offset = (page - 1) * limit;
            
            let sql = `
                SELECT br.*, b.title, b.author, b.isbn
                FROM borrow_records br
                JOIN books b ON br.book_id = b.id
            `;
            let countSql = 'SELECT COUNT(*) as total FROM borrow_records';
            const params = [];
            
            if (status) {
                sql += ' WHERE br.status = ?';
                countSql += ' WHERE status = ?';
                params.push(status);
            }
            
            sql += ' ORDER BY br.created_at DESC LIMIT ? OFFSET ?';
            
            const records = await database.all(sql, [...params, parseInt(limit), parseInt(offset)]);
            const { total } = await database.get(countSql, params);
            
            res.json({
                code: 0,
                msg: 'success',
                data: records,
                count: total,
                page: parseInt(page),
                limit: parseInt(limit)
            });
        } catch (error) {
            console.error('获取借阅记录失败:', error);
            res.status(500).json({
                code: -1,
                msg: '获取借阅记录失败',
                error: error.message
            });
        }
    }
}

module.exports = new BorrowController();
```

### 创建借阅路由

创建 backend/src/routes/borrowRoutes.js：

```javascript
const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');

// 借阅相关路由
router.post('/borrow', borrowController.borrowBook);
router.put('/return/:id', borrowController.returnBook);
router.get('/records', borrowController.getBorrowRecords);

module.exports = router;
```

## 五、前端开发

### 创建主页面结构

创建 frontend/index.html：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>图书馆管理系统</title>
    <link rel="stylesheet" href="lib/layui/css/layui.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="layui-layout layui-layout-admin">
        <!-- 头部区域 -->
        <div class="layui-header">
            <div class="layui-logo layui-hide-xs layui-bg-black">图书馆管理系统</div>
            <ul class="layui-nav layui-layout-right">
                <li class="layui-nav-item">
                    <a href="javascript:;">
                        <i class="layui-icon layui-icon-username" style="font-size: 24px; margin-right: 5px;"></i>
                        管理员
                    </a>
                </li>
                <li class="layui-nav-item"><a href="javascript:;">退出</a></li>
            </ul>
        </div>
        
        <!-- 侧边栏区域 -->
        <div class="layui-side layui-bg-black">
            <div class="layui-side-scroll">
                <ul class="layui-nav layui-nav-tree" lay-filter="test">
                    <li class="layui-nav-item layui-nav-itemed">
                        <a href="javascript:;">图书管理</a>
                        <dl class="layui-nav-child">
                            <dd><a href="javascript:;" data-page="book-list">图书列表</a></dd>
                            <dd><a href="javascript:;" data-page="book-add">添加图书</a></dd>
                        </dl>
                    </li>
                    <li class="layui-nav-item">
                        <a href="javascript:;">借阅管理</a>
                        <dl class="layui-nav-child">
                            <dd><a href="javascript:;" data-page="borrow-list">借阅记录</a></dd>
                            <dd><a href="javascript:;" data-page="borrow-add">图书借阅</a></dd>
                        </dl>
                    </li>
                </ul>
            </div>
        </div>
        
        <!-- 主体内容区域 -->
        <div class="layui-body">
            <div class="layui-tab" lay-allowClose="true" lay-filter="mainTab">
                <ul class="layui-tab-title">
                    <li class="layui-this">欢迎页</li>
                </ul>
                <div class="layui-tab-content">
                    <div class="layui-tab-item layui-show">
                        <div class="welcome-container">
                            <h1>欢迎使用图书馆管理系统</h1>
                            <p>请从左侧菜单选择功能开始使用</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 底部固定区域 -->
        <div class="layui-footer">
            © 2024 图书馆管理系统 - Node.js 实践项目
        </div>
    </div>
    
    <!-- 页面模板 -->
    <script type="text/html" id="book-list-tpl">
        <div class="layui-card">
            <div class="layui-card-header">图书列表</div>
            <div class="layui-card-body">
                <div class="layui-form layui-form-pane">
                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label">搜索</label>
                            <div class="layui-input-inline">
                                <input type="text" id="searchInput" placeholder="书名/作者/ISBN" class="layui-input">
                            </div>
                            <button class="layui-btn" id="searchBtn">搜索</button>
                            <button class="layui-btn layui-btn-primary" id="resetBtn">重置</button>
                        </div>
                    </div>
                </div>
                <table id="bookTable" lay-filter="bookTable"></table>
            </div>
        </div>
    </script>
    
    <script type="text/html" id="book-add-tpl">
        <div class="layui-card">
            <div class="layui-card-header">添加图书</div>
            <div class="layui-card-body">
                <form class="layui-form" id="bookForm">
                    <div class="layui-form-item">
                        <label class="layui-form-label">ISBN</label>
                        <div class="layui-input-block">
                            <input type="text" name="isbn" required lay-verify="required" placeholder="请输入ISBN" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">书名</label>
                        <div class="layui-input-block">
                            <input type="text" name="title" required lay-verify="required" placeholder="请输入书名" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">作者</label>
                        <div class="layui-input-block">
                            <input type="text" name="author" required lay-verify="required" placeholder="请输入作者" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">出版社</label>
                        <div class="layui-input-block">
                            <input type="text" name="publisher" placeholder="请输入出版社" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">出版日期</label>
                        <div class="layui-input-block">
                            <input type="text" name="publish_date" id="publishDate" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">分类</label>
                        <div class="layui-input-block">
                            <select name="category">
                                <option value="">请选择分类</option>
                                <option value="编程">编程</option>
                                <option value="文学">文学</option>
                                <option value="历史">历史</option>
                                <option value="科学">科学</option>
                                <option value="其他">其他</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <div class="layui-input-block">
                            <button class="layui-btn" lay-submit lay-filter="bookSubmit">立即提交</button>
                            <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </script>
    
    <!-- 引入依赖库 -->
    <script src="lib/jquery/jquery-3.6.0.min.js"></script>
    <script src="lib/layui/layui.js"></script>
    <script src="js/config.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

### 创建样式文件

创建 frontend/css/style.css：

```css
/* 全局样式 */
body {
    background-color: #f2f2f2;
}

/* 欢迎页样式 */
.welcome-container {
    text-align: center;
    padding: 100px 20px;
}

.welcome-container h1 {
    font-size: 36px;
    color: #333;
    margin-bottom: 20px;
}

.welcome-container p {
    font-size: 18px;
    color: #666;
}

/* 卡片样式 */
.layui-card {
    margin: 15px;
}

/* 表单样式 */
.layui-form {
    padding: 20px 20px 0 0;
}

/* 表格操作栏样式 */
.table-toolbar {
    padding: 10px 0;
}

/* 响应式调整 */
@media screen and (max-width: 750px) {
    .layui-form-item .layui-inline {
        margin-bottom: 10px;
    }
    
    .layui-form-item .layui-input-inline {
        width: 100%;
    }
}

/* 自定义滚动条 */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}
```

### 创建配置文件

创建 frontend/js/config.js：

```javascript
// API 配置
const API_BASE_URL = 'http://localhost:3000/api';

// API 端点
const API_ENDPOINTS = {
    books: {
        list: `${API_BASE_URL}/books`,
        detail: (id) => `${API_BASE_URL}/books/${id}`,
        create: `${API_BASE_URL}/books`,
        update: (id) => `${API_BASE_URL}/books/${id}`,
        delete: (id) => `${API_BASE_URL}/books/${id}`
    },
    borrow: {
        borrow: `${API_BASE_URL}/borrow/borrow`,
        return: (id) => `${API_BASE_URL}/borrow/return/${id}`,
        records: `${API_BASE_URL}/borrow/records`
    }
};

// 通用 AJAX 请求封装
function request(options) {
    const defaults = {
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        error: function(xhr, status, error) {
            console.error('请求失败:', error);
            layer.msg('请求失败: ' + (xhr.responseJSON?.msg || error), {icon: 2});
        }
    };
    
    // 合并选项
    const settings = $.extend({}, defaults, options);
    
    // 如果是 POST/PUT 请求且 data 是对象，转换为 JSON
    if ((settings.type === 'POST' || settings.type === 'PUT') && 
        settings.data && typeof settings.data === 'object') {
        settings.data = JSON.stringify(settings.data);
    }
    
    return $.ajax(settings);
}
```

### 创建主应用脚本

创建 frontend/js/app.js：

```javascript
// 等待 DOM 和 Layui 加载完成
$(document).ready(function() {
    layui.use(['element', 'table', 'form', 'laydate', 'layer'], function() {
        const element = layui.element;
        const table = layui.table;
        const form = layui.form;
        const laydate = layui.laydate;
        const layer = layui.layer;
        
        // 页面路由管理
        const pageManager = {
            currentPage: null,
            
            // 加载页面
            loadPage: function(pageName, title) {
                const tplId = `#${pageName}-tpl`;
                const content = $(tplId).html();
                
                if (!content) {
                    layer.msg('页面模板不存在', {icon: 2});
                    return;
                }
                
                // 检查是否已存在该标签页
                let tabExist = false;
                $('.layui-tab-title li').each(function() {
                    if ($(this).attr('lay-id') === pageName) {
                        tabExist = true;
                        element.tabChange('mainTab', pageName);
                        return false;
                    }
                });
                
                if (!tabExist) {
                    // 新增标签页
                    element.tabAdd('mainTab', {
                        title: title,
                        content: content,
                        id: pageName
                    });
                    element.tabChange('mainTab', pageName);
                }
                
                this.currentPage = pageName;
                
                // 初始化页面
                this.initPage(pageName);
            },
            
            // 初始化页面
            initPage: function(pageName) {
                switch(pageName) {
                    case 'book-list':
                        this.initBookList();
                        break;
                    case 'book-add':
                        this.initBookAdd();
                        break;
                    case 'borrow-list':
                        this.initBorrowList();
                        break;
                    case 'borrow-add':
                        this.initBorrowAdd();
                        break;
                }
            },
            
            // 初始化图书列表
            initBookList: function() {
                // 渲染表格
                table.render({
                    elem: '#bookTable',
                    url: API_ENDPOINTS.books.list,
                    method: 'GET',
                    page: true,
                    cols: [[
                        {field: 'id', title: 'ID', width: 80, sort: true},
                        {field: 'isbn', title: 'ISBN', width: 150},
                        {field: 'title', title: '书名', minWidth: 200},
                        {field: 'author', title: '作者', width: 150},
                        {field: 'publisher', title: '出版社', width: 150},
                        {field: 'category', title: '分类', width: 100},
                        {field: 'status', title: '状态', width: 100, templet: function(d) {
                            return d.status === 'available' ? 
                                '<span class="layui-badge layui-bg-green">可借</span>' : 
                                '<span class="layui-badge">已借出</span>';
                        }},
                        {title: '操作', width: 180, align: 'center', toolbar: '#bookToolbar'}
                    ]],
                    parseData: function(res) {
                        return {
                            code: res.code,
                            msg: res.msg,
                            count: res.count,
                            data: res.data
                        };
                    }
                });
                
                // 搜索功能
                $('#searchBtn').off('click').on('click', function() {
                    const search = $('#searchInput').val();
                    table.reload('bookTable', {
                        where: { search: search },
                        page: { curr: 1 }
                    });
                });
                
                // 重置功能
                $('#resetBtn').off('click').on('click', function() {
                    $('#searchInput').val('');
                    table.reload('bookTable', {
                        where: { search: '' },
                        page: { curr: 1 }
                    });
                });
                
                // 监听工具条事件
                table.on('tool(bookTable)', function(obj) {
                    const data = obj.data;
                    
                    if (obj.event === 'edit') {
                        // 编辑图书
                        layer.open({
                            type: 1,
                            title: '编辑图书',
                            area: ['500px', '450px'],
                            content: $('#book-edit-form').html(),
                            success: function(layero, index) {
                                // 填充表单数据
                                form.val('editBookForm', data);
                                form.render();
                                
                                // 日期选择器
                                laydate.render({
                                    elem: '#editPublishDate'
                                });
                                
                                // 监听提交
                                form.on('submit(editBookSubmit)', function(formData) {
                                    request({
                                        url: API_ENDPOINTS.books.update(data.id),
                                        type: 'PUT',
                                        data: formData.field,
                                        success: function(res) {
                                            if (res.code === 0) {
                                                layer.msg('更新成功', {icon: 1});
                                                layer.close(index);
                                                table.reload('bookTable');
                                            }
                                        }
                                    });
                                    return false;
                                });
                            }
                        });
                    } else if (obj.event === 'delete') {
                        // 删除图书
                        layer.confirm('确定删除这本图书吗？', function(index) {
                            request({
                                url: API_ENDPOINTS.books.delete(data.id),
                                type: 'DELETE',
                                success: function(res) {
                                    if (res.code === 0) {
                                        layer.msg('删除成功', {icon: 1});
                                        obj.del();
                                    }
                                }
                            });
                            layer.close(index);
                        });
                    }
                });
            },
            
            // 初始化添加图书
            initBookAdd: function() {
                // 日期选择器
                laydate.render({
                    elem: '#publishDate'
                });
                
                // 重新渲染表单
                form.render();
                
                // 监听提交
                form.on('submit(bookSubmit)', function(data) {
                    request({
                        url: API_ENDPOINTS.books.create,
                        type: 'POST',
                        data: data.field,
                        success: function(res) {
                            if (res.code === 0) {
                                layer.msg('添加成功', {icon: 1});
                                // 重置表单
                                $('#bookForm')[0].reset();
                                form.render();
                            }
                        }
                    });
                    return false;
                });
            },
            
            // 初始化借阅列表
            initBorrowList: function() {
                table.render({
                    elem: '#borrowTable',
                    url: API_ENDPOINTS.borrow.records,
                    method: 'GET',
                    page: true,
                    cols: [[
                        {field: 'id', title: 'ID', width: 80},
                        {field: 'title', title: '书名', minWidth: 200},
                        {field: 'borrower_name', title: '借阅人', width: 120},
                        {field: 'borrower_phone', title: '联系电话', width: 150},
                        {field: 'borrow_date', title: '借阅日期', width: 120},
                        {field: 'return_date', title: '归还日期', width: 120},
                        {field: 'status', title: '状态', width: 100, templet: function(d) {
                            return d.status === 'borrowing' ? 
                                '<span class="layui-badge">借阅中</span>' : 
                                '<span class="layui-badge layui-bg-green">已归还</span>';
                        }},
                        {title: '操作', width: 120, align: 'center', templet: function(d) {
                            return d.status === 'borrowing' ? 
                                '<button class="layui-btn layui-btn-sm" onclick="returnBook(' + d.id + ')">归还</button>' : 
                                '-';
                        }}
                    ]],
                    parseData: function(res) {
                        return {
                            code: res.code,
                            msg: res.msg,
                            count: res.count,
                            data: res.data
                        };
                    }
                });
            }
        };
        
        // 归还图书函数（全局）
        window.returnBook = function(id) {
            layer.confirm('确定归还这本图书吗？', function(index) {
                request({
                    url: API_ENDPOINTS.borrow.return(id),
                    type: 'PUT',
                    success: function(res) {
                        if (res.code === 0) {
                            layer.msg('归还成功', {icon: 1});
                            table.reload('borrowTable');
                        }
                    }
                });
                layer.close(index);
            });
        };
        
        // 监听导航点击
        element.on('nav(test)', function(elem) {
            const page = $(elem).attr('data-page');
            const title = $(elem).text();
            
            if (page) {
                pageManager.loadPage(page, title);
            }
        });
        
        // 工具条模板
        const toolbarTpl = `
            <script type="text/html" id="bookToolbar">
                <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
                <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="delete">删除</a>
            </script>
        `;
        $('body').append(toolbarTpl);
        
        // 编辑表单模板
        const editFormTpl = `
            <script type="text/html" id="book-edit-form">
                <form class="layui-form" lay-filter="editBookForm" style="padding: 20px;">
                    <div class="layui-form-item">
                        <label class="layui-form-label">书名</label>
                        <div class="layui-input-block">
                            <input type="text" name="title" required lay-verify="required" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">作者</label>
                        <div class="layui-input-block">
                            <input type="text" name="author" required lay-verify="required" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">出版社</label>
                        <div class="layui-input-block">
                            <input type="text" name="publisher" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">出版日期</label>
                        <div class="layui-input-block">
                            <input type="text" name="publish_date" id="editPublishDate" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">分类</label>
                        <div class="layui-input-block">
                            <select name="category">
                                <option value="">请选择分类</option>
                                <option value="编程">编程</option>
                                <option value="文学">文学</option>
                                <option value="历史">历史</option>
                                <option value="科学">科学</option>
                                <option value="其他">其他</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <div class="layui-input-block">
                            <button class="layui-btn" lay-submit lay-filter="editBookSubmit">提交</button>
                        </div>
                    </div>
                </form>
            </script>
        `;
        $('body').append(editFormTpl);
    });
});
```

## 六、开发调试与运行

### VS Code 配置

为了提高开发效率，建议在 VS Code 中安装以下扩展：

1. **ESLint** - JavaScript 代码质量检查工具
2. **Prettier** - 代码格式化工具
3. **SQLite Viewer** - 查看 SQLite 数据库文件
4. **Live Server** - 为前端提供实时预览
5. **Node.js Extension Pack** - Node.js 开发工具集

创建 .vscode/settings.json 配置文件：

```json
{
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "files.exclude": {
        "node_modules": true,
        "*.log": true
    },
    "search.exclude": {
        "node_modules": true,
        "**/lib": true
    }
}
```

### 创建 ESLint 配置

在项目根目录创建 .eslintrc.json：

```json
{
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
        "jquery": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "no-unused-vars": ["warn"],
        "no-console": ["off"]
    }
}
```

### 运行项目

1. **启动后端服务**：

在 VS Code 终端中，进入 backend 目录：

```bash
cd backend
npm run dev
```

服务器将在 http://localhost:3000 启动，可以访问该地址查看 API 信息。

1. **启动前端服务**：

使用 VS Code 的 Live Server 扩展，右键点击 frontend/index.html，选择 "Open with Live Server"。前端将在 http://localhost:5500 启动。

### 测试 API

使用 VS Code 的 REST Client 扩展或创建测试文件 backend/test.http：

```http
### 获取所有图书
GET http://localhost:3000/api/books

### 添加新图书
POST http://localhost:3000/api/books
Content-Type: application/json

{
    "isbn": "9787121234567",
    "title": "Vue.js实战",
    "author": "张三",
    "publisher": "电子工业出版社",
    "publish_date": "2023-01-01",
    "category": "编程"
}

### 借阅图书
POST http://localhost:3000/api/borrow/borrow
Content-Type: application/json

{
    "book_id": 1,
    "borrower_name": "李四",
    "borrower_phone": "13800138000"
}
```

## 七、项目优化与最佳实践总结

### 代码组织最佳实践

1. **模块化设计**：将功能分解为独立的模块，每个模块负责单一职责。控制器处理业务逻辑，路由定义 API 端点，模型管理数据访问。
2. **配置分离**：将配置信息（如数据库路径、端口号）集中管理，便于不同环境的部署。
3. **错误处理**：实现统一的错误处理机制，包括数据验证错误、数据库错误和网络错误。
4. **日志记录**：记录关键操作和错误信息，便于调试和监控。

### npm 使用最佳实践

1. **语义化版本控制**：在 package.json 中使用语义化版本号，明确依赖的版本范围。
2. **区分依赖类型**：正确区分 dependencies 和 devDependencies，减小生产环境的包体积。
3. **使用 npm scripts**：利用 npm scripts 自动化常见任务，如启动、测试和构建。
4. **锁定依赖版本**：使用 package-lock.json 确保团队成员使用相同版本的依赖。

### 安全性考虑

虽然本教程重点是教学，但仍需了解基本的安全实践：

1. **输入验证**：对所有用户输入进行验证，防止 SQL 注入和 XSS 攻击。
2. **CORS 配置**：在生产环境中，应配置具体的域名而非允许所有来源。
3. **错误信息**：避免向客户端暴露敏感的错误信息，如数据库结构。
4. **HTTPS**：在生产环境中使用 HTTPS 加密通信。

### 性能优化建议

1. **数据库索引**：为常用查询字段创建索引，提高查询性能。
2. **分页查询**：使用分页避免一次加载大量数据。
3. **缓存策略**：对不常变化的数据实施缓存。
4. **异步操作**：使用 Promise 和 async/await 处理异步操作，避免阻塞。

## 八、总结

通过本教程，我们学习了如何使用 Node.js 和 npm 构建一个前后端分离的图书馆管理系统。主要涵盖了以下知识点：

1. **Node.js 项目结构**：了解了如何组织 Node.js 项目的目录结构，实现模块化开发。
2. **npm 包管理**：掌握了 npm init、install 等命令，理解了 package.json 的作用和配置。
3. **Express 框架**：学习了如何使用 Express 构建 RESTful API，包括路由、中间件和错误处理。
4. **SQLite 数据库**：实践了 SQLite 数据库的基本操作，包括建表、查询和事务处理。
5. **前后端分离**：理解了前后端分离的架构，掌握了使用 jQuery AJAX 进行数据交互。
6. **VS Code 开发**：熟悉了使用 VS Code 进行全栈开发的工作流程。

这个项目虽然功能简单，但涵盖了 Web 开发的核心概念。学生可以在此基础上继续扩展功能，如添加用户认证、图书分类管理、统计报表等，进一步深化对 Node.js 生态系统的理解。

记住，优秀的代码不仅要能运行，还要易于理解和维护。持续学习和实践是成为优秀开发者的关键。