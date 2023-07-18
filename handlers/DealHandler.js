const { default: mongoose } = require("mongoose");
const Deal = require("../models/Deal");

class DealHandler {
  static insertNewDeal({
    item_discount_id,
    item_id,
    discount_max_amount,
    discount,
    discount_type = "percentage",
    userId
  }) {
    const deal = new Deal({
      _id: new mongoose.Types.ObjectId(),
      item_discount_id,
      item_id,
      discount_max_amount,
      discount,
      discount_type,
      userId
    });

    return deal.save();
  }

  static getDeals({ perPage = 10, currentPage = 0 }) {
    const lookupAggregate = Deal.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "item_id",
          foreignField: "_id",
          as: "item",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "item_discount_id",
          foreignField: "_id",
          as: "item_discount",
        },
      },
      {
        $project: {
          _id: 1,
          item_name: { $arrayElemAt: ["$item.name", 0] },
          item_discount_name: { $arrayElemAt: ["$item_discount.name", 0] },
          item_id: 1,
          item_discount_id: 1,
          discount_max_amount: 1,
          discount: 1,
          discount_type: 1,
        },
      },
    ]);

    return Deal.aggregatePaginate(lookupAggregate, {
      page: currentPage,
      limit: perPage,
    });
  }

  static deleteDeal(dealId) {
    return Deal.deleteOne({ _id: new mongoose.Types.ObjectId(dealId) });
  }

  static deleteDealByProduct(productId) {
    return Deal.deleteMany({
      $or: [
        { item_id: new mongoose.Types.ObjectId(productId) },
        { item_discount_id: new mongoose.Types.ObjectId(productId) },
      ],
    });
  }

  static getDealsByItemIds(products) {
    return Deal.find({
      item_id: { $in: products.map((p) => new mongoose.Types.ObjectId(p._id)) },
    }).lean();
  }

  static insertManyDeals(deals) {
    return Deal.insertMany(deals);
  }

  static findExistingDeal(item_id, item_discount_id) {
    return Deal.find({ item_id, item_discount_id })
  }
}

module.exports = DealHandler;
