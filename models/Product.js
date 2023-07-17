const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    unique: true
  },
  price: {
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

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("products", productSchema);
