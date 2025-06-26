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