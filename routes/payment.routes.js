
// router.get("/disproduct",cartController.displayProducts)
// router.post("/add",cartController.addToCart)
// router.put("edit/:id",cartController.editItem)
// router.delete("delete/:id",cartController.deleteItem)


// const paymentController=require('../controllers/payment.controller');
// const express = require("express")
// const router=express.Router();
// router.post("/checkout");
// router.post("/webhook");
// router.get("/status/:id");

const express = require('express');
const router = express.Router();
const { createFawryPayment } = require('../controllers/paymentController');

router.post('/pay/fawry', createFawryPayment);

module.exports = router;


