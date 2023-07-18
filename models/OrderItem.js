const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  quantity: {
    type: String,
  },
  productName: {
    type: String,
  },
  discount: {
    type: String,
  },
  price: {
    type: Number,
  },
  discountedPrice: {
    type: String,
  },
  tax: {
    type: Number,
  },
  userId: {
    type: String,
  },
});

module.exports = mongoose.model("order_items", orderItemSchema);
