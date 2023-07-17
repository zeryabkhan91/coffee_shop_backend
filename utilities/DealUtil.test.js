const DealUtil = require("./DealUtil");
const { Exception } = require("../helpers");

describe("DealUtil", () => {
  describe("validateUtil", () => {
    test("should throw an exception if item discount ID is not provided", () => {
      expect(() => {
        DealUtil.validateUtil({ item_id: "item1" });
      }).toThrow();
    });

    test("should throw an exception if item ID is not provided", () => {
      expect(() => {
        DealUtil.validateUtil({ item_discount_id: "discount1" });
      }).toThrow();
    });

    test("should throw an exception if item discount ID is the same as the item ID", () => {
      expect(() => {
        DealUtil.validateUtil({ item_discount_id: "item1", item_id: "item1" });
      }).toThrow();
    });

    test("should not throw an exception if all required parameters are provided correctly", () => {
      expect(() => {
        DealUtil.validateUtil({ item_discount_id: "discount1", item_id: "item1" });
      }).not.toThrow();
    });
  });
});
