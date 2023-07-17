const mongoose = require("mongoose");
const DealHandler = require("./DealHandler");
const Deal = require("../models/Deal");
const Aggregate = require("mongoose-aggregate-paginate-v2");

jest.mock("../models/Deal");

describe("DealHandler", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("insertNewDeal", () => {
    test("should insert a new deal", async () => {
      const dealData = {
        item_discount_id: new mongoose.Types.ObjectId(),
        item_id: new mongoose.Types.ObjectId(),
        discount_max_amount: 50,
        discount: 10,
        discount_type: "percentage",
      };

      const saveMock = jest.fn().mockResolvedValue(dealData);
      Deal.prototype.save = saveMock;

      await DealHandler.insertNewDeal(dealData);

      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(saveMock).toHaveBeenCalledWith();
    });
  });

  describe("getDeals", () => {
    test("should retrieve deals with pagination", async () => {
      const perPage = 10;
      const currentPage = 1;
      const expectedDeals = [];  
     
      Deal.aggregatePaginate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ docs: expectedDeals }),
      });
  
      const result = await DealHandler.getDeals({ perPage, currentPage }).exec();
      
      expect(result.docs).toEqual(expectedDeals);
    });
  });
  
  describe("deleteDeal", () => {
    test("should delete a deal", async () => {
      const dealId = new mongoose.Types.ObjectId();

      const deleteOneMock = jest.fn().mockResolvedValue({});
      Deal.deleteOne = deleteOneMock;

      await DealHandler.deleteDeal(dealId);

      expect(deleteOneMock).toHaveBeenCalledTimes(1);
      expect(deleteOneMock).toHaveBeenCalledWith({ _id: dealId });
    });
  });

  describe("deleteDealByProduct", () => {
    test("should delete deals by product", async () => {
      const productId = new mongoose.Types.ObjectId();

      const deleteManyMock = jest.fn().mockResolvedValue({});
      Deal.deleteMany = deleteManyMock;

      await DealHandler.deleteDealByProduct(productId);

      expect(deleteManyMock).toHaveBeenCalledTimes(1);
      expect(deleteManyMock).toHaveBeenCalledWith({
        $or: [
          { item_id: productId },
          { item_discount_id: productId },
        ],
      });
    });
  });

  describe("getDealsByItemIds", () => {
    test("should retrieve deals by item IDs", async () => {
      const products = [
        { _id: new mongoose.Types.ObjectId() },
        { _id: new mongoose.Types.ObjectId() },
      ];
      const expectedDeals = [];

      const findMock = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(expectedDeals),
      });
      Deal.find = findMock;

      const result = await DealHandler.getDealsByItemIds(products);

      expect(result).toEqual(expectedDeals);
      expect(findMock).toHaveBeenCalledTimes(1);
      expect(findMock).toHaveBeenCalledWith({
        item_id: {
          $in: products.map((p) => p._id),
        },
      });
    });
  });
});
