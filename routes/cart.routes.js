const cartController=require('../controllers/cart.controller');
const express=require('express');
const router=express.Router();
router.get("/",cartController.displayProducts)
router.post("/",cartController.addToCart)
router.put("/:id",cartController.editItem)
router.delete("/:id",cartController.deleteItem)


module.exports=router;