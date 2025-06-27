const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");
const authenticateToken = require("../controllers/auth.middleware");
const { permit } = require("../middlewares/role.middleware");

// All wishlist routes require authentication
router.use(authenticateToken);

// Get user's wishlist
router.get("/", wishlistController.getWishlist);

// Add product to wishlist
router.post("/add", wishlistController.addToWishlist);

// Remove product from wishlist
router.delete("/remove", wishlistController.removeFromWishlist);

// Clear entire wishlist
router.delete("/clear", wishlistController.clearWishlist);

// Check if product is in wishlist
router.get("/check/:productId", wishlistController.checkWishlistStatus);

// Admin route to get all wishlists
router.get("/admin/all", permit("admin"), wishlistController.getAllWishlists);

module.exports = router;