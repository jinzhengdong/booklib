# 图书馆管理系统

基于 Node.js 的前后端分离图书馆管理系统，采用现代化的 Web 开发技术栈构建。本项目是 Node.js 和 npm 最佳实践的教学示例，展示了完整的全栈开发流程。

## 📋 项目概述

这是一个功能完整的图书馆管理系统，支持图书的增删改查、借阅管理、归还管理等核心功能。系统采用前后端分离架构，后端提供 RESTful API，前端使用 Layui 框架构建现代化的管理界面。

### 🎯 主要功能

- **图书管理**
  - 图书信息的增删改查
  - 图书搜索（支持书名、作者、ISBN）
  - 图书分类管理
  - 分页显示

- **借阅管理**
  - 图书借阅登记
  - 借阅记录查询
  - 图书归还处理
  - 借阅状态筛选

## 🛠 技术栈

### 后端技术
- **Node.js** - JavaScript 运行环境
- **Express** - Web 应用框架
- **SQLite3** - 轻量级数据库
- **CORS** - 跨域资源共享中间件
- **Body-parser** - 请求体解析中间件

### 前端技术
- **Layui** - 现代化 UI 框架
- **jQuery** - JavaScript 库
- **HTML5 & CSS3** - 页面结构和样式

### 开发工具
- **nodemon** - 开发环境自动重启工具
- **ESLint** - 代码质量检查工具

## 📁 项目结构

```
booklib/
├── backend/                    # 后端代码
│   ├── src/                   # 源代码目录
│   │   ├── config/           # 配置文件
│   │   │   └── database.js   # 数据库连接配置
│   │   ├── controllers/      # 控制器
│   │   │   ├── bookController.js    # 图书控制器
│   │   │   └── borrowController.js  # 借阅控制器
│   │   └── routes/           # 路由定义
│   │       ├── bookRoutes.js    # 图书路由
│   │       └── borrowRoutes.js  # 借阅路由
│   ├── database/             # 数据库文件
│   │   ├── booklibrary.db   # SQLite 数据库文件
│   │   └── init.js          # 数据库初始化脚本
│   ├── package.json         # 后端依赖配置
│   ├── server.js           # 服务器入口文件
│   └── test.http           # API 测试文件
├── frontend/               # 前端代码
│   ├── css/               # 样式文件
│   │   └── style.css
│   ├── js/                # JavaScript 文件
│   │   ├── app.js        # 主应用逻辑
│   │   └── config.js     # 配置文件
│   ├── lib/              # 第三方库
│   │   ├── jquery/       # jQuery 库
│   │   └── layui/        # Layui 框架
│   ├── index.html        # 主页面
│   └── package.json      # 前端依赖配置
├── .eslintrc.json        # ESLint 配置
└── README.md            # 项目说明文档
```

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd booklib
   ```

2. **安装后端依赖**
   ```bash
   cd backend
   npm install
   ```

3. **初始化数据库**
   ```bash
   node database/init.js
   ```

4. **安装前端依赖**
   ```bash
   cd ../frontend
   npm install
   ```

### 运行项目

1. **启动后端服务**
   ```bash
   cd backend
   npm run dev
   ```
   服务器将在 http://localhost:3000 启动

2. **启动前端服务**
   
   使用 VS Code 的 Live Server 扩展：
   - 右键点击 `frontend/index.html`
   - 选择 "Open with Live Server"
   
   或使用其他静态文件服务器，前端将在 http://localhost:5500 启动

## 📚 API 文档

### 图书管理 API

| 方法 | 路径 | 描述 | 参数 |
|------|------|------|------|
| GET | `/api/books` | 获取图书列表 | `page`, `limit`, `search` |
| GET | `/api/books/:id` | 获取单本图书详情 | `id` |
| POST | `/api/books` | 添加新图书 | `isbn`, `title`, `author`, `publisher`, `publish_date`, `category` |
| PUT | `/api/books/:id` | 更新图书信息 | `id`, `title`, `author`, `publisher`, `publish_date`, `category` |
| DELETE | `/api/books/:id` | 删除图书 | `id` |

### 借阅管理 API

| 方法 | 路径 | 描述 | 参数 |
|------|------|------|------|
| POST | `/api/borrow/borrow` | 借阅图书 | `book_id`, `borrower_name`, `borrower_phone` |
| PUT | `/api/borrow/return/:id` | 归还图书 | `id` |
| GET | `/api/borrow/records` | 获取借阅记录 | `page`, `limit`, `status` |

### API 响应格式

```json
{
  "code": 0,
  "msg": "success",
  "data": {},
  "count": 100
}
```

## 🗄️ 数据库设计

### 图书表 (books)
- `id` - 主键，自增
- `isbn` - ISBN号，唯一
- `title` - 书名
- `author` - 作者
- `publisher` - 出版社
- `publish_date` - 出版日期
- `category` - 分类
- `status` - 状态 (available/borrowed)
- `created_at` - 创建时间
- `updated_at` - 更新时间

### 借阅记录表 (borrow_records)
- `id` - 主键，自增
- `book_id` - 图书ID，外键
- `borrower_name` - 借阅人姓名
- `borrower_phone` - 借阅人电话
- `borrow_date` - 借阅日期
- `return_date` - 归还日期
- `status` - 状态 (borrowing/returned)
- `created_at` - 创建时间

## 🧪 测试

使用 VS Code 的 REST Client 扩展，可以直接运行 `backend/test.http` 文件中的 API 测试用例。

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
```

## 📝 开发规范

### 代码风格
项目使用 ESLint 进行代码质量检查，配置文件为 `.eslintrc.json`。

### Git 提交规范
- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 🔧 配置说明

### 环境变量
- `PORT` - 服务器端口号，默认 3000

### 数据库配置
数据库文件位于 `backend/database/booklibrary.db`，如需重新初始化：
```bash
cd backend
node database/init.js
```

## 📖 学习资源

本项目是 Node.js 和 npm 最佳实践的教学示例，详细的开发过程和最佳实践说明请参考：
- [Node.js 和 npm 最佳实践 - 图书馆管理系统.md](./Node.js%20和%20npm%20最佳实践%20-%20图书馆管理系统.md)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

如有问题或建议，请提交 Issue 或联系项目维护者。

---

**注意**: 这是一个教学项目，主要用于学习 Node.js 全栈开发。在生产环境中使用前，请确保添加适当的安全措施和错误处理。