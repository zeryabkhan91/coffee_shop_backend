const express = require('express');
const ProductController = require('../controller/ProductController');
const router = express.Router();

router.post('/', ProductController.createNewProduct);
router.get('/', ProductController.getProducts);
router.get('/all', ProductController.getAllProducts);
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;
