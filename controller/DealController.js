const { Validators } = require("../helpers");
const { ErrorCodes, ErrorMessages } = require("../constants");
const DealService = require("../services/DealService");

class DealController {
  static async createNewDeal(req, res) {
    try {

      const data = await DealService.createNewDeal(req.body);

      res.json({
        success: true,
        data
      });

    } catch(err) {
      console.log(err);
      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : ErrorMessages.MESSAGES.SOMETHING_WENT_WRONG
      });
    }
  }

  static async getDeals(req, res) {
    try {
      const { limit: perPage = 10, offset = 0 } = req.query

      const currentPage = offset ? Math.ceil((offset - 1) / perPage) + 1 : 1;

      const data = await DealService.getDeals({ currentPage, perPage });

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

  static async deleteDeal(req, res) {
    try {

      const data = await DealService.deleteDeals(req.params.id);

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

module.exports = DealController;