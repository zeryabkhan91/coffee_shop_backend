const { Validators } = require("../helpers");
const { ErrorCodes, ErrorMessages } = require("../constants");
const OrderService = require("../services/OrderService");

class OrderController {
  static async createNewOrder(req, res) {
    try {

      const { orders, userId } = req.body;

      const data = await OrderService.createNewOrder(orders, userId);

      res.json({
        success: true,
        ...data
      });

    } catch(err) {
      console.log(err);
      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : ErrorMessages.MESSAGES.SOMETHING_WENT_WRONG
      });
    }
  }

  static async getOrders(req, res) {
    try {
      const { limit: perPage = 10, currentPage } = req.query

      const data = await OrderService.getOrders({ currentPage, perPage });

      res.json({
        success: true,
        ...data
      });

    } catch(err) {
      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : ErrorMessages.MESSAGES.SOMETHING_WENT_WRONG
      });
    }
  }

}

module.exports = OrderController;