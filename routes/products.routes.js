const express = require("express");
const router = express.Router();
const productController = require("../controllers/products.controller");

router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getSingleProduct);
router.get("/related/:id", productController.getRelatedProducts);
router.put("/:id", productController.updateProduct);
router.delete("/", productController.deleteAllProducts);
//router.delete("/:id", productController.deleteProduct);
router.post("/bulk", productController.addBulkProducts);
router.get("/featured", productController.getFueaturedProducts);

module.exports = router;
