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