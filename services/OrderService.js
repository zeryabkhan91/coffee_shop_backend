const { OrderHandler, OrderItemHandler, DealHandler } = require("../handlers");
const Socket = require("../middleware/Socket");
const { OrderUtil } = require("../utilities");

class OrderService {
  static async createNewOrder(products, userId) {
    OrderUtil.validateUtil(products);

    const newOrder = OrderHandler.newOrderMongoObject({ status: "started", userId });

    const deals = await DealHandler.getDealsByItemIds(products);

    const orderItems = [];
    const usedItems = [];

    for (const product of products) {
      const discountedPrice = OrderUtil.calculateDiscountedPrice(
        product,
        deals,
        products,
        usedItems
      );

      const productTax = product.price * ((product.tax_rate || 0) / 100);

      const orderItem = {
        orderId: newOrder._id,
        productId: product._id,
        productName: product.name,
        quantity: product.quantity,
        price: product.price,
        tax: productTax,
        discount: product.price * product.quantity - discountedPrice,
        discountedPrice: discountedPrice + productTax,
      };
      orderItems.push(orderItem);
    }

    await OrderItemHandler.bulkInsertOrderItem(orderItems);

    newOrder.totalAmount = orderItems
      .map((item) => item.discountedPrice)
      .reduce((a, b) => a + b, 0);

    return OrderHandler.insertNewOrder(newOrder);
  }

  static getOrders(filter) {
    return OrderHandler.getOrders(filter);
  }

  static deleteOrders(id) {
    return OrderHandler.deleteOrder(id);
  }

  static async updateStatusOfOrdersToProcessing() {
    console.log("Job updateStatusOfOrdersToProcessing started")
    const orders = await OrderHandler.findAndModify("started", "processing");

    orders.forEach((order) => {
      Socket.io.emit("notification", {
        data: { userId: order.userId, _id: order._id, status: order.status },
      });
    })

    console.log("Job updateStatusOfOrdersToProcessing ended")
  }

  static async updateStatusOfOrdersToComplete() {
    console.log("Job updateStatusOfOrdersToComplete started")
    const orders = await OrderHandler.findAndModify("processing", "completed")

    orders.forEach((order) => {
      Socket.io.emit("notification", {
        data: { userId: order.userId, _id: order._id, status: order.status },
      });
    })

    console.log("Job updateStatusOfOrdersToComplete ended")
  }

}

module.exports = OrderService;
