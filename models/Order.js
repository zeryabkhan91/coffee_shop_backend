const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  status: {
    type: String,
  },
  totalAmount: {
    type: Number,
  },
  userId: {
    type: String,
  },

});

orderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("orders", orderSchema);
