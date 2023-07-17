const config = require('config');
const OrderService = require('../services/OrderService');

class CronJobManager {

  static registerCronJobs () {

    setInterval(OrderService.updateStatusOfOrdersToProcessing, config.intervals.orderProcessing);

    setInterval(OrderService.updateStatusOfOrdersToComplete, config.intervals.orderCompletion);

  }

}

module.exports = CronJobManager;
