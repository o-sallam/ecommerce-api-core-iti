const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let wishlist = await Wishlist.findOne({ user: userId })
      .populate({
        path: "items.productId",
        select: "name price description images thumbnail category",
        populate: {
          path: "category",
          select: "name"
        }
      });

    if (!wishlist) {
      // Create empty wishlist if it doesn't exist
      wishlist = new Wishlist({
        user: userId,
        items: [],
        totalItems: 0,
      });
      await wishlist.save();
    }

    // Transform the response to match frontend expectations
    const transformedWishlist = {
      id: wishlist._id,
      user: wishlist.user,
      items: wishlist.items.map(item => ({
        productId: {
          id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          description: item.productId.description,
          images: item.productId.images,
          thumbnail: item.productId.thumbnail,
          category: item.productId.category ? item.productId.category.name : 'Unknown'
        },
        addedAt: item.addedAt
      })),
      totalItems: wishlist.totalItems,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt
    };

    res.status(200).json(transformedWishlist);
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find or create user's wishlist
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [], totalItems: 0 });
    }

    // Check if item already exists in wishlist
    const itemExists = wishlist.items.some(
      (item) => item.productId.toString() === productId
    );

    if (itemExists) {
      return res.status(400).json({ error: "Product already in wishlist" });
    }

    // Add new item to wishlist
    wishlist.items.push({
      productId: productId,
      addedAt: new Date(),
    });

    await wishlist.save();

    res.status(200).json({ 
      message: "Product added to wishlist successfully",
      totalItems: wishlist.totalItems 
    });
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    // Find the item in the wishlist
    const itemIndex = wishlist.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in wishlist" });
    }

    // Remove the item
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    res.status(200).json({ 
      message: "Product removed from wishlist successfully",
      totalItems: wishlist.totalItems 
    });
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    wishlist.items = [];
    await wishlist.save();

    res.status(200).json({ 
      message: "Wishlist cleared successfully",
      totalItems: wishlist.totalItems 
    });
  } catch (err) {
    console.error("Error clearing wishlist:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const checkWishlistStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(200).json({ inWishlist: false });
    }

    const inWishlist = wishlist.items.some(
      (item) => item.productId.toString() === productId
    );

    res.status(200).json({ inWishlist });
  } catch (err) {
    console.error("Error checking wishlist status:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin function to get all wishlists
const getAllWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.find()
      .populate("user", "username email")
      .populate({
        path: "items.productId",
        select: "name price thumbnail"
      });
    
    res.status(200).json(wishlists);
  } catch (err) {
    console.error("Error fetching all wishlists:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlistStatus,
  getAllWishlists,
};