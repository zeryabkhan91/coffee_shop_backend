const mongoose = require("mongoose");
const Product = require("../models/Product");
const ProductHandler = require("./ProductHandler");

describe("ProductHandler", () => {
  describe("insertNewProduct", () => {
    test("should insert a new product", async () => {
      const product = {
        name: "Product 1",
        price: 10,
      };

      // Mock the save function
      jest.spyOn(Product.prototype, "save").mockResolvedValue(product);

      const newProduct = await ProductHandler.insertNewProduct(product);

      expect(newProduct).toEqual(product);
      expect(Product.prototype.save).toHaveBeenCalledTimes(1);

      // Restore the original implementation of save
      Product.prototype.save.mockRestore();
    });
  });

  describe("findProduct", () => {
    test("should find products based on provided options", async () => {
      const options = { category: "Electronics" };
      const expectedProducts = [{ name: "Product 1", price: 10 }];

      // Mock the find function
      jest.spyOn(Product, "find").mockResolvedValue(expectedProducts);

      const products = await ProductHandler.findProduct(options);

      expect(products).toEqual(expectedProducts);
      expect(Product.find).toHaveBeenCalledTimes(1);
      expect(Product.find).toHaveBeenCalledWith(options);

      // Restore the original implementation of find
      Product.find.mockRestore();
    });
  });

  describe("getProducts", () => {
    test("should get paginated products", async () => {
      const perPage = 10;
      const currentPage = 1;
      const expectedProducts = [{ name: "Product 1", price: 10 }];

      // Mock the paginate function
      jest.spyOn(Product, "paginate").mockResolvedValue({
        docs: expectedProducts,
        totalDocs: 5,
        totalPages: 1,
        page: currentPage,
      });

      const result = await ProductHandler.getProducts({
        perPage,
        currentPage,
      });

      expect(result).toEqual({
        docs: expectedProducts,
        totalDocs: 5,
        totalPages: 1,
        page: 1,
      });
      expect(Product.paginate).toHaveBeenCalledTimes(1);
      expect(Product.paginate).toHaveBeenCalledWith({}, { page: currentPage, limit: perPage });

      // Restore the original implementation of paginate
      Product.paginate.mockRestore();
    });
  });

  describe("getAllProducts", () => {
    test("should get all products", async () => {
      const expectedProducts = [{ name: "Product 1", price: 10 }];

      // Mock the find function
      jest.spyOn(Product, "find").mockResolvedValue(expectedProducts);

      const products = await ProductHandler.getAllProducts();

      expect(products).toEqual(expectedProducts);
      expect(Product.find).toHaveBeenCalledTimes(1);
      expect(Product.find).toHaveBeenCalledWith({});

      // Restore the original implementation of find
      Product.find.mockRestore();
    });
  });

  describe("deleteProduct", () => {
    test("should delete a product by ID", async () => {
      const productId = new mongoose.Types.ObjectId();

      // Mock the deleteOne function
      jest.spyOn(Product, "deleteOne").mockResolvedValue({ n: 1 });

      const result = await ProductHandler.deleteProduct(productId);

      expect(result).toEqual({ n: 1 });
      expect(Product.deleteOne).toHaveBeenCalledTimes(1);
      expect(Product.deleteOne).toHaveBeenCalledWith({ _id: new mongoose.Types.ObjectId(productId) });

      // Restore the original implementation of deleteOne
      Product.deleteOne.mockRestore();
    });
  });
});
