const mongoose = require("mongoose");
const Order = require("../models/Order");
const OrderHandler = require("./OrderHandler");

describe("OrderHandler", () => {
  describe("insertNewOrder", () => {
    test("should insert a new order", async () => {
      const order = new Order({
        orderId: "order1",
        totalAmount: 100,
        status: "pending",
      });

      // Mock the save function
      jest.spyOn(order, "save").mockResolvedValue(order);

      const newOrder = await OrderHandler.insertNewOrder(order);

      expect(newOrder).toEqual(order);
      expect(order.save).toHaveBeenCalledTimes(1);

      // Restore the original implementation of save
      order.save.mockRestore();
    });
  });

  describe("newOrderMongoObject", () => {
    test("should create a new Order object with a generated ObjectId", () => {
      const payload = {
        totalAmount: 100,
        status: "pending",
      };

      const newOrder = OrderHandler.newOrderMongoObject(payload);

      expect(newOrder).toBeInstanceOf(Order);
      expect(newOrder._id).toBeInstanceOf(mongoose.Types.ObjectId);
      expect(newOrder.totalAmount).toBe(payload.totalAmount);
      expect(newOrder.status).toBe(payload.status);
    });
  });

  describe("getOrders", () => {
    test("should get paginated orders with order items", async () => {
      const perPage = 10;
      const currentPage = 1;
      const expectedOrders = [
        {
          _id: "order1",
          totalAmount: 100,
          status: "pending",
          order_items: [
            { _id: "item1", productName: "Product 1", quantity: 2 },
            { _id: "item2", productName: "Product 2", quantity: 3 },
          ],
        },
      ];

      // Mock the aggregatePaginate function
      jest.spyOn(Order, "aggregatePaginate").mockResolvedValue({
        docs: expectedOrders,
        totalDocs: 1,
        totalPages: 1,
        page: currentPage,
      });

      const result = await OrderHandler.getOrders({
        perPage,
        currentPage,
      });

      expect(result).toEqual({
        docs: expectedOrders,
        totalDocs: 1,
        totalPages: 1,
        page: 1,
      });
      expect(Order.aggregatePaginate).toHaveBeenCalledTimes(1);
      expect(Order.aggregatePaginate).toHaveBeenCalledWith(
        expect.any(Object),
        { page: currentPage, limit: perPage }
      );

      // Restore the original implementation of aggregatePaginate
      Order.aggregatePaginate.mockRestore();
    });
  });
});
