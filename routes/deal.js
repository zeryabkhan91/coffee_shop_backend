const express = require('express');
const DealController = require('../controller/DealController');
const router = express.Router();

router.post('/', DealController.createNewDeal);
router.get('/', DealController.getDeals);
router.delete('/:id', DealController.deleteDeal);

module.exports = router;
