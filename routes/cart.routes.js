const cartController=require('../controllers/cart.controller');
const express=require('express');
const router=express.Router();
router.get("/",cartController.getCart)
router.post("/",cartController.getCart)
router.put("/:id",cartController.getCart)
router.delete("/:id",cartController.getCart)


module.exports=router;