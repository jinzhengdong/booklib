const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');

// 借阅相关路由
router.post('/borrow', borrowController.borrowBook);
router.put('/return/:id', borrowController.returnBook);
router.get('/records', borrowController.getBorrowRecords);

module.exports = router;