const { Validators } = require("../helpers");
const { ErrorCodes, ErrorMessages } = require("../constants");
const ProductService = require("../services/ProductService");

class ProductController {
  static async createNewProduct(req, res) {
    try {

      const data = await ProductService.createNewProduct(req.body);

      res.json({
        success: true,
        data
      });

    } catch(err) {
      console.log("err", err)
      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : ErrorMessages.MESSAGES.SOMETHING_WENT_WRONG
      });
    }
  }

  static async getProducts(req, res) {
    try {
      const { limit: perPage = 10, currentPage = 1 } = req.query

      const data = await ProductService.getProducts({ currentPage, perPage });

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

  static async getAllProducts(req, res) {
    try {

      const products = await ProductService.getAllProducts();

      res.json({
        success: true,
        products
      });

    } catch(err) {
      console.log(err)
      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : ErrorMessages.MESSAGES.SOMETHING_WENT_WRONG
      });
    }
  }

  static async deleteProduct(req, res) {
    try {

      const data = await ProductService.deleteProduct(req.params.id);

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

module.exports = ProductController;