const Cart = require("../models/cart.model");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const existingItem = await Cart.findOne({ userId, productId });
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.timeStamp = Date.now();
      await existingItem.save();
      return res.json({ message: "Add more of the item", cart: existingItem });
    }
    const newCartItem = new Cart({
      userId,
      productId,
      quantity,
      timeStamp: Date.now(),
    });
    await newCartItem.save();
    res.status(201).json({ message: "Item added to cart", cart: newCartItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


const displayProducts = (req, res) => {
  res.json({ cart: req.session.cart || [] });
};


const editItem =async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const updatedItem = await Cart.findByIdAndUpdate(
      productId,
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

const deleteItem = (req, res) => {
  const productId = req.body.productId;
  const cart = req.session.cart;
  cart = cart.filter((item) => item.productId !== productId);
  res.send({ success: true, cart: cart });
};

module.exports = {
  addToCart,
  displayProducts,
  editItem,
  deleteItem,
};
