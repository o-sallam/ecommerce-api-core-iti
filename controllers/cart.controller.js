const Cart = require("../models/cart.model");
const bcrypt = require("bcryptjs");

// const getCart=app.get(async(req,res)=>{

// })


const addToCartContoller = (req,res) =>{
  try{
    const {prodectId}= req?.body;
    const currentUser=req.userId

  }catch(err){
    res.json({
      message : err ?.message || err,
      error :true,
      success :false
    })
  }
}
//////////////////////////////////
module.exports = {
getCart
};