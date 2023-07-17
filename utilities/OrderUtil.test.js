const OrderUtil = require("./OrderUtil");
const { Exception } = require("../helpers");
const Discount = require("../enums/Discount");
const { default: mongoose } = require("mongoose");

describe("OrderUtil", () => {
  describe("validateUtil", () => {
    test("should throw an exception if product quantity is less than 1", () => {
      const items = [
        { quantity: 0, _id: new mongoose.Types.ObjectId() },
        { quantity: -1, _id: new mongoose.Types.ObjectId() },
      ];

      expect(() => {
        OrderUtil.validateUtil(items);
      }).toThrow();
    });

    test("should throw an exception if product does not contain a valid ID", () => {
      const items = [{ quantity: 1 }, { quantity: 2 }];

      expect(() => {
        OrderUtil.validateUtil(items);
      }).toThrow();
    });

    test("should not throw an exception if all products have valid quantity and ID", () => {
      const items = [
        { quantity: 1, _id: new mongoose.Types.ObjectId() },
        { quantity: 2, _id: new mongoose.Types.ObjectId() },
      ];

      expect(() => {
        OrderUtil.validateUtil(items);
      }).not.toThrow();
    });
  });

  describe("calcualteSingleDealDiscount", () => {
    test("should calculate single deal discount based on percentage", () => {
      const deal = {
        discount_type: Discount.TYPE.PERCENTAGE,
        discount: 20,
      };
      const product = {
        price: 100,
      };

      const singleDealDiscount = OrderUtil.calcualteSingleDealDiscount(
        deal,
        product
      );

      expect(singleDealDiscount.discountedValue).toEqual(80);
    });

    test("should calculate single deal discount based on amount", () => {
      const deal = {
        discount_type: Discount.TYPE.AMOUNT,
        discount: 10,
      };
      const product = {
        price: 50,
      };

      const singleDealDiscount = OrderUtil.calcualteSingleDealDiscount(
        deal,
        product
      );

      expect(singleDealDiscount.discountedValue).toEqual(40);
    });

  });

  describe("calcualteSingleProductDiscount", () => {
    test("should calculate single product discount based on percentage", () => {
      const product = {
        price: 100,
        discount_type: Discount.TYPE.PERCENTAGE,
        discount: 20,
      };

      const singleProductDiscount = OrderUtil.calcualteSingleProductDiscount(
        product
      );

      expect(singleProductDiscount.discountedPrice).toEqual(80);
    });

    test("should calculate single product discount based on amount", () => {
      const product = {
        price: 50,
        discount_type: Discount.TYPE.AMOUNT,
        discount: 10,
      };

      const singleProductDiscount = OrderUtil.calcualteSingleProductDiscount(
        product
      );

      expect(singleProductDiscount.discountedPrice).toEqual(40);
    });

  });

});
