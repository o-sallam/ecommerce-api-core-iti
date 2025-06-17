const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    method: { type: String, enum: ["fawry", "visa", "cash"], required: true },
    providerRef: String,
    amount: Number,
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    responsePayload: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
