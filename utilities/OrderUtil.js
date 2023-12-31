const { Exception } = require("../helpers");
const Discount = require("../enums/Discount");
const { default: mongoose } = require("mongoose");

class OrderUtil {
  static validateUtil(items) {
    for (const item of items) {
      if (!item.quantity) {
        throw new Exception("Product quantity cannot be less than 1", 400, {
          reportError: true,
        }).toJson();
      }

      if (!item._id) {
        throw new Exception("Provided Product does not contain valid Id", 400, {
          reportError: true,
        }).toJson();
      }
    }
  }

  static calculateDiscountedPrice(product, deals, products, usedProducts) {
    const dealDiscount = this.findMinimalDeal(product, deals, usedProducts);
    let discountedPrice = 0;

    if (dealDiscount) {
      const parentProduct = products.find((_product) =>
        new mongoose.Types.ObjectId(_product._id).equals(dealDiscount.item_id)
      );

      usedProducts.push(new mongoose.Types.ObjectId(parentProduct._id));

      const parentQuantity = parentProduct.quantity;
      const childQuantity = product.quantity;
      const discountValue = dealDiscount.discountedValue;

      const discountedQuantity = Math.min(parentQuantity, childQuantity);

      discountedPrice =
        discountedQuantity * discountValue;
    } else {
      const calculatedProduct = this.calcualteSingleProductDiscount(product);
      const quantity = product.quantity;

      discountedPrice = calculatedProduct.discountedPrice * quantity;
    }

    return discountedPrice;
  }

  static calcualteSingleDealDiscount(deal, product) {
    const discountType = deal.discount_type;
    const discount = deal.discount;
    const price = product.price;
    let discountedPrice = 0;

    if (!discount) return price;

    if (discountType === Discount.TYPE.PERCENTAGE) {
      discountedPrice = price - (price * discount || 0) / 100;
    } else if (discountType === Discount.TYPE.AMOUNT) {
      discountedPrice = price - discount;
    }

    const discountedValue =
      deal.discount_max_amount &&
      price - discountedPrice > deal.discount_max_amount
        ? deal.discount_max_amount
        : price - discountedPrice;

    return {
      ...deal,
      discountedValue,
    };
  }

  static calcualteSingleProductDiscount(product) {
    const discountType = product.discount_type;
    const discount = product.discount;
    const price = product.price;
    let discountedPrice = 0;

    if (!discount) return { ...product, discountedPrice: 0 };

    if (discountType === Discount.TYPE.PERCENTAGE) {
      discountedPrice = price - (price * discount || 0) / 100;
    } else if (discountType === Discount.TYPE.AMOUNT) {
      discountedPrice = price - discount;
    }

    const discountedValue =
      product.discount_max_amount &&
      price - discountedPrice > product.discount_max_amount
        ? product.discount_max_amount
        : (price - discountedPrice);

    return { ...product, discountedPrice: discountedValue };
  }

  static findMinimalDeal(product, deals, usedProducts = []) {

    const productAddonDeals = deals.filter(
      (deal) =>
        deal.item_discount_id.equals(product._id) &&
        !usedProducts.find(productId => productId.equals(deal.item_id))
    );

    const productDiscount = product.discount
      ? this.calcualteSingleProductDiscount(product)
      : {};

    if (!productAddonDeals.length) return null;

    const minDealDiscount = productAddonDeals
      .map((deal) => this.calcualteSingleDealDiscount(deal, product))
      .reduce((a, b) => (a.discountedValue > b.discountedValue ? a : b), 0);

    return productDiscount.discountedPrice &&
      (productDiscount.discountedPrice || 0) < minDealDiscount.discountedValue
      ? null
      : minDealDiscount;
  }
}

module.exports = OrderUtil;
