const { default: mongoose } = require("mongoose");
const Order = require("../models/Order");

class OrderHandler {
  static insertNewOrder(order) {
    return order.save();
  }

  static newOrderMongoObject(payload) {
    return new Order({
      ...payload,
      _id: new mongoose.Types.ObjectId(),
    });
  }

  static getOrders({ perPage = 10, currentPage = 1 }) {
    const orderAggregate = Order.aggregate([
      {
        $lookup: {
          from: "order_items",
          localField: "_id",
          foreignField: "orderId",
          as: "order_items",
        },
      },
    ]);

    return Order.aggregatePaginate(orderAggregate, {
      page: currentPage,
      limit: perPage,
    });
  }

  static async findAndModify(status, updatedStatus) {
    const orders = await Order.find({ status });
    
    for (const order of orders) {
      order.status = updatedStatus;
      await order.save();
    }
    return orders
  }
}

module.exports = OrderHandler;
