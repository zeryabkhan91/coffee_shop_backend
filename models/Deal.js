const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

const dealSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  item_id: mongoose.Schema.Types.ObjectId,
  item_discount_id: mongoose.Schema.Types.ObjectId,
  discount_max_amount: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  discount_type: {
    type: String,
  },
  userId: {
    type: String,
  },
});

dealSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("deals", dealSchema);
