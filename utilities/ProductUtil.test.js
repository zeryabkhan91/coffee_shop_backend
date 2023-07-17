const ProductUtil = require("./ProductUtil");
const { Exception } = require("../helpers");

describe("ProductUtil", () => {
  describe("validateUtil", () => {
    test("should throw an exception if name is not provided", () => {
      expect(() => {
        ProductUtil.validateUtil({ price: 10, discount: 5 });
      }).toThrow();
    });

    test("should throw an exception if price is not provided", () => {
      expect(() => {
        ProductUtil.validateUtil({ name: "Product 1", discount: 5 });
      }).toThrow();
    });

    test("should throw an exception if discount is not provided or not a number", () => {
      expect(() => {
        ProductUtil.validateUtil({ name: "Product 1", price: 10 });
      }).toThrow();

      expect(() => {
        ProductUtil.validateUtil({ name: "Product 2", price: 20, discount: "10" });
      }).not.toThrow();
    });

    test("should not throw an exception if all required parameters are provided", () => {
      expect(() => {
        ProductUtil.validateUtil({ name: "Product 1", price: 10, discount: 5 });
      }).not.toThrow();
    });
  });
});