const { Exception } = require("../helpers");

class ProductUtil {
  static validateUtil({ name, price, category, discount }) {
    if (!name) {
      throw new Exception("Name not found", 400, { reportError: true }).toJson()
    }

    if (!price) {
      throw new Exception("Price not found", 400, { reportError: true }).toJson()
    }

    if (!discount && discount !== 0) {
      throw new Exception("Discount not found", 400, { reportError: true }).toJson()
    }
  }
}

module.exports = ProductUtil;