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