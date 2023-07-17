const { Exception } = require("../helpers");

class DealUtil {
  static validateUtil({ item_discount_id, item_id, test }) {
    if (!item_discount_id) {
      throw new Exception("Item Discount ID not found", 400, { reportError: true }).toJson()
    }

    if (!item_id) {
      throw new Exception("Item ID not found", 400, { reportError: true }).toJson()
    }

    if (item_discount_id === item_id) {
      throw new Exception("AddOn should be different from Item", 400, { reportError: true }).toJson()
    }
  }

  static checkExistingDeal(deal) {
    if (deal?.length) {
      throw new Exception("Deal with same combination exists", 400, { reportError: true }).toJson()
    }
  }
}

module.exports = DealUtil;