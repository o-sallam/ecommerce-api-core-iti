const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1"],
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensures one cart per user
    },
    items: [cartItemSchema],
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalItems: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Calculate total before saving
cartSchema.pre("save", function (next) {
  if (this.isModified("items")) {
    this.total = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
