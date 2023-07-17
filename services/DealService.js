const { DealHandler } = require("../handlers");
const { DealUtil } = require("../utilities");

class DealService {
  static async createNewDeal(deal) {
    DealUtil.validateUtil(deal);

    const existingDeal = await DealHandler.findExistingDeal(deal.item_id, deal.item_discount_id)

    DealUtil.checkExistingDeal(existingDeal)
    return DealHandler.insertNewDeal(deal);
  }

  static getDeals(filter) {
    return DealHandler.getDeals(filter);
  }

  static deleteDeals(id) {
    return DealHandler.deleteDeal(id);
  }
}

module.exports = DealService;
