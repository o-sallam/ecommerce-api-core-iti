const Cart = require("../models/cart.model");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const increaseQuantity = async (req, res) => {
  try {
    const authHeader =
      req.header("Authorization") || req.header("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    // Find product to get price
    let product = await require("../models/product.model").findById(productId);
    let productData = null;
    if (!product) {
      // Product not found in DB, add with price 0
      productData = {
        _id: productId,
        price: 0,
      };
    } else {
      productData = {
        _id: product._id,
        price: product.price,
      };
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [], total: 0, totalItems: 0 });
    }

    // Check if item exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      // Increase quantity
      cart.items[itemIndex].quantity += 1;
    } else {
      // Add new item (even if product not found, use price 0)
      cart.items.push({
        productId: productData._id,
        quantity: 1,
        price: productData.price,
      });
    }

    // Update totals
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    await cart.save();

    res.status(200).json({ cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const decreaseQuantity = async (req, res) => {
  try {
    const authHeader =
      req.header("Authorization") || req.header("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // Decrease quantity or remove item
    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    // Update totals
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    await cart.save();

    res.status(200).json({ cart });
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
  try {
    const authHeader =
      req.header("Authorization") || req.header("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    console.log(authHeader);
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const cart = await Cart.findOne({ user: userId }).populate('items.productId');
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const cartObj = cart.toObject();
    cartObj.id = cartObj._id;
    delete cartObj._id;
    // Move id to end of object for response
    const { id, ...rest } = cartObj;
    // Ensure productId is full product object in each item
    rest.items = rest.items.map(item => ({
      ...item,
      productId: item.productId
    }));
    res.json({ ...rest, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
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
