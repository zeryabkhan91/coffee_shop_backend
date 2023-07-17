const express = require('express');
const router = express.Router();
const dealRoutes = require('./deal')
const productRoute = require('./product')
const orderRoutes = require('./order')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Coffee Shop' });
});

router.use('/api/v1/deal', dealRoutes)
router.use('/api/v1/orders', orderRoutes)
router.use('/api/v1/products', productRoute)

module.exports = router;
