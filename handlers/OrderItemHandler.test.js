const mongoose = require("mongoose");
const OrderItem = require("../models/OrderItem");
const OrderItemHandler = require("./OrderItemHandler");

// Custom matcher function to compare arrays of objects regardless of order
const arrayToHaveSameObjects = (received, expected) => {
  expect(received).toHaveLength(expected.length);

  expected.forEach((expectedItem) => {
    expect(
      received.some(
        (receivedItem) =>
          expectedItem._id.toString() === receivedItem._id.toString()
      )
    ).toBeTruthy();
  });
};

describe("OrderItemHandler", () => {
  describe("bulkInsertOrderItem", () => {
    test("should bulk insert order items", async () => {
      const orderItems = [
        {
          orderId: "64b4331be1ad5aabb5178dd1",
          productId: "64b4331be1ad5aabb5178dd2",
          quantity: "2",
          productName: "Product 1",
          discount: "10",
          price: 20,
          discountedPrice: "18",
        },
        {
          orderId: "64b4331be1ad5aabb5178dd3",
          productId: "64b4331be1ad5aabb5178dd4",
          quantity: "3",
          productName: "Product 2",
          discount: "15",
          price: 30,
          discountedPrice: "25.5",
        },
      ];

      // Generate mock order items with _id values
      const mockOrderItems = orderItems.map((orderItem) => ({
        ...orderItem,
        _id: new mongoose.Types.ObjectId(),
      }));

      // Mock the insertMany function
      jest.spyOn(OrderItem, "insertMany").mockResolvedValue(mockOrderItems);

      const result = await OrderItemHandler.bulkInsertOrderItem(orderItems);

      expect(result).toHaveLength(mockOrderItems.length);
      arrayToHaveSameObjects(result, mockOrderItems);
      expect(OrderItem.insertMany).toHaveBeenCalledTimes(1);

      // Restore the original implementation of insertMany
      OrderItem.insertMany.mockRestore();
    });
  });
});
