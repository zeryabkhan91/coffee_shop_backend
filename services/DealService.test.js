const { DealHandler } = require("../handlers");
const { Exception } = require("../helpers");
const { DealUtil } = require("../utilities");
const DealService = require("./DealService");

describe("DealService", () => {
  describe("createNewDeal", () => {
    test("should create a new deal with valid input", async () => {
      const deal = {
        item_discount_id: "item-discount-1",
        item_id: "item-1",
        discount_max_amount: 10,
        discount: 5,
        discount_type: "percentage",
      };

      const existingDeal = null;

      DealUtil.validateUtil = jest.fn(); // Mock the validateUtil method
      DealHandler.findExistingDeal = jest.fn().mockResolvedValue(existingDeal); // Mock the findExistingDeal method
      DealUtil.checkExistingDeal = jest.fn(); // Mock the checkExistingDeal method
      DealHandler.insertNewDeal = jest.fn().mockResolvedValue(deal); // Mock the insertNewDeal method

      const result = await DealService.createNewDeal(deal);

      expect(DealUtil.validateUtil).toHaveBeenCalledWith(deal);
      expect(DealHandler.findExistingDeal).toHaveBeenCalledWith(deal.item_id, deal.item_discount_id);
      expect(DealUtil.checkExistingDeal).toHaveBeenCalledWith(existingDeal);
      expect(DealHandler.insertNewDeal).toHaveBeenCalledWith(deal);
      expect(result).toEqual(deal);
    });

    test("should throw an exception if the deal fails validation", async () => {
      const deal = {
        item_discount_id: null,
        item_id: "item-1",
        discount_max_amount: 10,
        discount: 5,
        discount_type: "percentage",
      };

      DealUtil.validateUtil = jest.fn().mockImplementation(() => {
        throw new Exception("Item Discount ID not found", 400, { reportError: true }).toJson();
      });

      await expect(DealService.createNewDeal(deal)).rejects.toEqual(
        new Exception("Item Discount ID not found", 400, { reportError: true }).toJson()
      );
    });

    test("should throw an exception if the deal already exists", async () => {
      const deal = {
        item_discount_id: "item-discount-1",
        item_id: "item-1",
        discount_max_amount: 10,
        discount: 5,
        discount_type: "percentage",
      };

      const existingDeal = {
        _id: "existing-deal-1",
        item_discount_id: "item-discount-1",
        item_id: "item-1",
        discount_max_amount: 15,
        discount: 10,
        discount_type: "percentage",
      };

      DealUtil.validateUtil = jest.fn();
      DealHandler.findExistingDeal = jest.fn().mockResolvedValue(existingDeal);
      DealUtil.checkExistingDeal = jest.fn().mockImplementation(() => {
        throw new Exception("Deal with same combination exists", 400, { reportError: true }).toJson();
      });

      await expect(DealService.createNewDeal(deal)).rejects.toEqual(
        new Exception("Deal with same combination exists", 400, { reportError: true }).toJson()
      );
    });
  });

  describe("getDeals", () => {
    test("should retrieve deals with the provided filter", async () => {
      const filter = {
        discount_type: "percentage",
      };

      const expectedDeals = [
        {
          _id: "deal-1",
          item_discount_id: "item-discount-1",
          item_id: "item-1",
          discount_max_amount: 10,
          discount: 5,
          discount_type: "percentage",
        },
        {
          _id: "deal-2",
          item_discount_id: "item-discount-2",
          item_id: "item-2",
          discount_max_amount: 15,
          discount: 10,
          discount_type: "percentage",
        },
      ];

      DealHandler.getDeals = jest.fn().mockResolvedValue(expectedDeals); // Mock the getDeals method

      const result = await DealService.getDeals(filter);

      expect(DealHandler.getDeals).toHaveBeenCalledWith(filter);
      expect(result).toEqual(expectedDeals);
    });
  });

  describe("deleteDeals", () => {
    test("should delete the deal with the provided ID", async () => {
      const dealId = "deal-1";

      DealHandler.deleteDeal = jest.fn().mockResolvedValue(); // Mock the deleteDeal method

      await DealService.deleteDeals(dealId);

      expect(DealHandler.deleteDeal).toHaveBeenCalledWith(dealId);
    });
  });
});