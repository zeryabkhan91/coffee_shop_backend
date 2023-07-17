const { default: mongoose } = require("mongoose");
const { OrderHandler, OrderItemHandler, DealHandler } = require("../handlers");
const { OrderUtil } = require("../utilities");
const OrderService = require("./OrderService");

describe("OrderService", () => {
  describe("createNewOrder", () => {
    test("should create a new order with valid products", async () => {
      const products = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: "Product 1",
          quantity: 2,
          price: 10,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: "Product 2",
          quantity: 3,
          price: 15,
        },
      ];

      const newOrder = {
        _id: new mongoose.Types.ObjectId(),
        status: "started",
      };

      const deals = [
        {
          item_id: products[0]._id,
          item_discount_id: products[1]._id,
          discount_max_amount: 5,
          discount: 10,
          discount_type: "percentage",
        },
      ];

      const expectedOrderItems = [
        {
          orderId: newOrder._id,
          productId: products[0]._id,
          productName: "Product 1",
          quantity: 2,
          price: 10,
          discount: 0,
          discountedPrice: 20,
        },
        {
          orderId: newOrder._id,
          productId: products[1]._id,
          productName: "Product 2",
          quantity: 3,
          price: 15,
          discount: 15,
          discountedPrice: 40,
        },
      ];

      OrderUtil.validateUtil = jest.fn(); // Mock the validateUtil method
      OrderHandler.newOrderMongoObject = jest.fn().mockReturnValue(newOrder); // Mock the newOrderMongoObject method
      DealHandler.getDealsByItemIds = jest.fn().mockResolvedValue(deals); // Mock the getDealsByItemIds method
      OrderItemHandler.bulkInsertOrderItem = jest.fn().mockResolvedValue(); // Mock the bulkInsertOrderItem method
      OrderHandler.insertNewOrder = jest.fn().mockResolvedValue(newOrder); // Mock the insertNewOrder method

      const result = await OrderService.createNewOrder(products);

      expect(OrderUtil.validateUtil).toHaveBeenCalledWith(products);
      expect(OrderHandler.newOrderMongoObject).toHaveBeenCalledWith({ status: "started" });
      expect(DealHandler.getDealsByItemIds).toHaveBeenCalledWith(products);
      expect(OrderHandler.insertNewOrder).toHaveBeenCalledWith(newOrder);
      expect(result).toEqual(newOrder);
    });
  });

  describe("getOrders", () => {
    test("should retrieve orders with the provided filter", async () => {
      const filter = {
        status: "completed",
      };

      const expectedOrders = [
        {
          _id: "order-1",
          status: "completed",
          totalAmount: 50,
        },
        {
          _id: "order-2",
          status: "completed",
          totalAmount: 70,
        },
      ];

      OrderHandler.getOrders = jest.fn().mockResolvedValue(expectedOrders); // Mock the getOrders method

      const result = await OrderService.getOrders(filter);

      expect(OrderHandler.getOrders).toHaveBeenCalledWith(filter);
      expect(result).toEqual(expectedOrders);
    });
  });

  describe("deleteOrders", () => {
    test("should delete the order with the provided ID", async () => {
      const orderId = "order-1";

      OrderHandler.deleteOrder = jest.fn().mockResolvedValue(); // Mock the deleteOrder method

      await OrderService.deleteOrders(orderId);

      expect(OrderHandler.deleteOrder).toHaveBeenCalledWith(orderId);
    });
  });
});
