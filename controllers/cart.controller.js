const Cart = require("../models/cart.model");
const jwt = require("jsonwebtoken");

const increaseQuantity = async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const userId = decoded.id;
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity += 1;
      cartItem.timeStamp = Date.now();
    } else {
      cartItem = new Cart({
        userId,
        productId,
        quantity: 1,
        timeStamp: Date.now(),
      });
    }

    await cartItem.save();
    res.status(200).json({ message: "Cart updated successfully", cart: cartItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const decreaseQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity -= 1;

      if (cartItem.quantity > 0) {
        cartItem.timeStamp = Date.now();
        await cartItem.save();
        res.status(200).json({ message: "Item quantity decreased", cart: cartItem });
      } else {
        await Cart.findByIdAndDelete(cartItem._id);
        res.status(200).json({ message: "Item removed from cart" });
      }
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getCarts = async (req, res) => {
  try {
    const data = await Cart.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getCartByUserId = async (req, res) => {
  const userId = req.params.id;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  res.json(cart);
};

const displayProducts = async (req, res) => {
  try {
    const user = req.query.userId;
    const cartItems = await Cart.find({ user });
    res.json(cartItems);
    // const data = await Cart.find();
    // res.json(data.cart);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const editItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity, userId } = req.body;
  try {
    const updatedItem = await Cart.findOneAndUpdate(
      { userId, productId },
      { $set: { quantity } },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json({ message: "Cart item updated", cart: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    await Cart.deleteOne({ productId, userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const deleteAllItems = async (req, res) => {
  try {
    await Cart.deleteMany();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  increaseQuantity,
  decreaseQuantity,
  displayProducts,
  editItem,
  deleteItem,
  getCarts,
  getCartByUserId,
  deleteAllItems,
};
