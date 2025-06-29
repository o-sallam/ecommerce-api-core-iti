const Order = require("../models/order.model");
const User = require("../models/user.model");

// Confirm order submission
exports.confirmOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      paymentDetails,
      items,
      total,
      notes,
    } = req.body;

    // Get user ID from the authenticated token
    const userId = req.user.id;

    // Validate required fields
    if (!shippingAddress || !paymentMethod || !items || !total) {
      return res.status(400).json({
        ok: false,
        message:
          "Missing required fields: shippingAddress, paymentMethod, items, and total are required",
      });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Items must be a non-empty array",
      });
    }

    // Validate total amount
    if (total <= 0) {
      return res.status(400).json({
        ok: false,
        message: "Total amount must be greater than 0",
      });
    }

    // Create new order
    const order = new Order({
      userId,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      items,
      total,
      notes,
      status: "confirmed",
    });

    // Save the order
    await order.save();

    // Calculate remaining days until estimated delivery
    const now = new Date();
    const deliveryDate = order.estimatedDeliveryDate;
    const remainingDays = Math.ceil(
      (deliveryDate - now) / (1000 * 60 * 60 * 24)
    );

    // Return success response
    res.status(201).json({
      ok: true,
      remainingDays: Math.max(0, remainingDays),
      orderId: order._id,
      message: "Order confirmed successfully",
    });
  } catch (error) {
    console.error("Order confirmation error:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to confirm order. Please try again.",
    });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      ok: true,
      orders,
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to fetch orders",
    });
  }
};

// Get specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, userId }).populate(
      "items.productId"
    );

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      ok: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to fetch order",
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Order not found",
      });
    }

    // Only allow cancellation of pending or confirmed orders
    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        ok: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      ok: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to cancel order",
    });
  }
};
