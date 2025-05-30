const mongoose = require("mongoose");
const CartSchema = mongoose.Schema({
  userId: { type: String, require: true, unique: true },
  productId: { type: String, require: true, unique: true },
  quentity: { type: Number, require: true },
  tirmeStamp: { type: Number, require: true },
});
const Cart=mongoose.model("Cart",CartSchema);
module.exports = Cart;
