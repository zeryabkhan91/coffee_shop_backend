const { default: mongoose } = require("mongoose");
const Product = require("../models/Product");

class ProductHandler {
  static insertNewProduct(product) {
    const newProduct = new Product({ 
      ...product, 
      _id: new mongoose.Types.ObjectId(),
      discount_type: product.discount_type || 'percentage' 
    });

    return newProduct.save();
  }

  static findProduct(option = {}) {
    return Product.find(option)
  }

  static insertManyProducts(products) {
    return Product.insertMany(products)
  }

  static getProducts({ perPage = 10, currentPage = 0 }) {
    return Product.paginate({}, { page: currentPage, limit: perPage });
  }

  static getAllProducts() {
    return Product.find({});
  }

  static deleteProduct(productId) {
    return Product.deleteOne({ _id: new mongoose.Types.ObjectId(productId)});
  }
}

module.exports = ProductHandler;
