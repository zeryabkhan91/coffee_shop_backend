const { ProductHandler, DealHandler } = require("../handlers");
const { Exception } = require("../helpers");
const ProductService = require("../services/ProductService");
const { ProductUtil } = require("../utilities");

describe("ProductService", () => {
  describe("createNewProduct", () => {
    test("should throw an exception if the product fails validation", async () => {
      const product = {
        name: "Invalid Product",
        price: null, // Invalid price
        discount: 5,
      };

      ProductUtil.validateUtil = jest.fn().mockImplementation(() => {
        throw new Exception("Invalid product", 400, { reportError: true }).toJson();
      });

      ProductHandler.findProduct = jest.fn(); // Mock the findProduct method

      let insertNewProductCalled = false;
      ProductHandler.insertNewProduct = jest.fn().mockImplementation(() => {
        insertNewProductCalled = true;
        return Promise.resolve();
      });

      await expect(ProductService.createNewProduct(product)).rejects.toEqual(
        new Exception("Invalid product", 400, { reportError: true }).toJson()
      );

      expect(ProductUtil.validateUtil).toHaveBeenCalledWith(product);
      expect(ProductHandler.findProduct).not.toHaveBeenCalled();
      expect(insertNewProductCalled).toBe(false);
    });
  });


  describe("getProducts", () => {
    test("should retrieve products with the provided filter", async () => {
      const filter = { category: "Electronics" };
      const expectedProducts = [{ name: "Product 1" }, { name: "Product 2" }];

      ProductHandler.getProducts = jest.fn().mockResolvedValue(expectedProducts);

      const result = await ProductService.getProducts(filter);

      expect(ProductHandler.getProducts).toHaveBeenCalledWith(filter);
      expect(result).toEqual(expectedProducts);
    });
  });

  describe("getAllProducts", () => {
    test("should retrieve all products", async () => {
      const expectedProducts = [{ name: "Product 1" }, { name: "Product 2" }];

      ProductHandler.getAllProducts = jest.fn().mockResolvedValue(expectedProducts);

      const result = await ProductService.getAllProducts();

      expect(ProductHandler.getAllProducts).toHaveBeenCalled();
      expect(result).toEqual(expectedProducts);
    });
  });

  describe("deleteProduct", () => {
    test("should delete a product and associated deals by ID", async () => {
      const productId = "123456789";

      DealHandler.deleteDealByProduct = jest.fn().mockResolvedValue();
      ProductHandler.deleteProduct = jest.fn().mockResolvedValue();

      await ProductService.deleteProduct(productId);

      expect(DealHandler.deleteDealByProduct).toHaveBeenCalledWith(productId);
      expect(ProductHandler.deleteProduct).toHaveBeenCalledWith(productId);
    });
  });
});
