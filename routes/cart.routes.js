const cartController=require('../controllers/cart.controller');
const express=require('express');
const router=express.Router();
router.get("/disproduct",cartController.displayProducts)
router.post("/add",cartController.addToCart)
router.put("/edit/:id",cartController.editItem)
router.delete("delete/:id",cartController.deleteItem)


module.exports=router;