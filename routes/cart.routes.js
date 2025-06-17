const cartController = require("../controllers/cart.controller");
const express = require("express");
const router = express.Router();

router.get("/", cartController.getCarts);
router.get("/:id", cartController.getCartByUserId);
router.get("/disproduct", cartController.displayProducts);
router.post("/increase", cartController.increaseQuantity);
router.post("/decrease", cartController.decreaseQuantity);
router.put("/edit/:id", cartController.editItem);
router.delete("/delete/:id", cartController.deleteItem);
router.delete("/deleteAll", cartController.deleteAllItems);

module.exports = router;
