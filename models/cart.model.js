const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },     
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },     
  timeStamp: { type: Number, required: true },    
});

const Cart=mongoose.model("Cart",CartSchema);
module.exports = Cart;
