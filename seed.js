const mongoose = require("mongoose");
const config = require("config");
const { uuid } = require("uuidv4");
const products = require("./seeds/products.json");
const deals = require("./seeds/deal.json");
const ProductHandler = require("./handlers/ProductHandler");
const DealHandler = require("./handlers/DealHandler");

const seedDB = async () => {
  try {
    const userId = uuid();

    products.forEach((product) => {
      product.userId = userId;
    });

    await ProductHandler.insertManyProducts(products);
    console.log("Product Inserted successfully");

    const productsAvailable = await ProductHandler.findProduct();

    deals[0].item_id = productsAvailable[0]._id;
    deals[0].item_discount_id = productsAvailable[1]._id;
    deals[1].item_id = productsAvailable[2]._id;
    deals[1].item_discount_id = productsAvailable[3]._id;

    await DealHandler.insertManyDeals(deals);
    console.log("Deal Inserted successfully");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(config.database.connection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
    await seedDB();
    mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();
