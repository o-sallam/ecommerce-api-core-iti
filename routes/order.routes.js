const express = require("express");
const router = express.Router();
const {
  confirmOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
} = require("../controllers/order.controller");

// Confirm order submission
router.post("/confirm", confirmOrder);

// Get user's orders
router.get("/", getUserOrders);

// Get specific order by ID
router.get("/:orderId", getOrderById);

// Cancel order
router.put("/:orderId/cancel", cancelOrder);

module.exports = router;
