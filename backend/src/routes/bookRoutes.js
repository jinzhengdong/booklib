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