const mongoose= require ('mongoose');
const ProductSchema= new mongoose.Schema({

    name:{
        type: String,
        required:true,
        trim:true
    },

    price:{
        type:Number,
        required:true
    },

    description:{
        type:String,
        required:true,

    },

    inStock:{
        type:Boolean,
        default:true
    }



});

module.exports=mongoose.model('product',ProductSchema); // create a model called product from the schema to make crud operations


//const product = mongoose.model('product', ProductSchema); 
//module.exports = product; 
