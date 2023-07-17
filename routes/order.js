const express = require('express');
const OrderController = require('../controller/OrderController');
const router = express.Router();

router.post('/', OrderController.createNewOrder);
router.get('/', OrderController.getOrders);

module.exports = router;
