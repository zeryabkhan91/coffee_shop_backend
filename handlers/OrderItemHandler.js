const { default: mongoose } = require("mongoose");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");

class OrderItemHandler {
  static bulkInsertOrderItem(orderItems) {
    const newOrderItems = orderItems.map(orderItem => (new OrderItem({
      ...orderItem, 
      _id: new mongoose.Types.ObjectId(),
      discount_type: orderItem.discount_type || 'percentage' 
    })));

    return OrderItem.insertMany(newOrderItems);
  }
}

module.exports = OrderItemHandler;
