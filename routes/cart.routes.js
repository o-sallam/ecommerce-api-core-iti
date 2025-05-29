const cartController=require('../controllers/cart.controller');
const express=require('express');
const router=express.Router();
router.get("/cart",cartController.getCart)


module.exports=router;