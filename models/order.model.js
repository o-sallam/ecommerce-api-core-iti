const mongoose = require("mongoose");

const shippingAddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
});

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String },
});

const paymentDetailsSchema = new mongoose.Schema({
  cardName: String,
  cardNumber: String,
  expiryDate: String,
  cvv: String,
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shippingAddress: { type: shippingAddressSchema, required: true },
    paymentMethod: { type: String, required: true },
    paymentDetails: { type: paymentDetailsSchema },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    notes: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    orderNumber: { type: String, unique: true },
    estimatedDeliveryDate: Date,
    trackingNumber: String,
  },
  { timestamps: true }
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD-${year}${month}${day}-${(count + 1)
      .toString()
      .padStart(4, "0")}`;
  }

  // Set estimated delivery date (7 days from now)
  if (!this.estimatedDeliveryDate) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    this.estimatedDeliveryDate = deliveryDate;
  }

  next();
});

module.exports = mongoose.model("Order", orderSchema);
