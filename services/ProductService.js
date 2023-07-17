const { ProductHandler, DealHandler } = require("../handlers");
const { Exception } = require("../helpers");
const { ProductUtil } = require("../utilities");

class ProductService {
  static async createNewProduct(product) {
    ProductUtil.validateUtil(product);

    const response = await ProductHandler.findProduct({ name: product.name });

    if (response?.length) {
      throw new Exception("Product with this name already exists", 400, {
        reportError: true,
      }).toJson();
    }

    return ProductHandler.insertNewProduct(product);
  }

  static getProducts(filter) {
    return ProductHandler.getProducts(filter);
  }

  static getAllProducts() {
    return ProductHandler.getAllProducts();
  }

  static async deleteProduct(id) {
    await DealHandler.deleteDealByProduct(id);

    return ProductHandler.deleteProduct(id);
  }
}

module.exports = ProductService;
