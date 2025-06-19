const express = require("express");
const router = express.Router();
const productController = require("../controllers/products.controller");

router.get("/", productController.getAllProducts);
router.get(
  "/category/:categoryName",
  productController.getProductsByCategoryName
);
router.get("/featured", productController.getFeaturedProducts);
router.get("/:id", productController.getSingleProduct);
router.get("/related/:id", productController.getRelatedProducts);
router.post("/", productController.createProduct);
router.post("/bulk", productController.addBulkProducts);
router.put("/:id", productController.updateProduct);
router.put("/bulk", productController.updateBulkProducts);
router.put("/images/update-all", productController.updateAllProductImages);
router.delete("/", productController.deleteAllProducts);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
