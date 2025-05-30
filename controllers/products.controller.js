const product=require('../models/products.models');

//create new product "for admins"

const createProduct=async(req,res)=>{ //createproduct built in in express 
    const data=req.body;             //cause if i want to destructure the data i need to get from the body of the request // ex:{name}
    try{
        const newProduct=new product(data);
        await newProduct.save();      //save built in func to save the product to the database 
        res.status(201).json(newProduct);
    }
 catch(err){
    res.status(400).json({message:err.message}); //400 status code for bad request //err.message built in in error object 

}
};

//get all products
const getAllProducts=async(req,res)=>{
    try{
        const page=parseInt(req.query.page); //pagination //get the page number from the query string
        const capacity=6;                    //how many products per page
        const productList=await product.find().skip((page-1)* capacity).limit(capacity); //find built in func to get all products
        res.status(200).json(productList);
    }
    catch(err){
        res.status(500).json({message:err.message}); //500 status code for internal server error

    }
};

//get a single product by id  for product details page
const getSingleProduct=async(req,res)=>{
    const id=req.params.id;                                  //get the id from the request params
    try{
        const singleProduct=await product.findById(id);      //findById built in func to get a single product by id
        if(!singleProduct){
            return res.status(404).json({message:"product not found"});
               }
               res.status(200).json(singleProduct);      //if product was found, return it

    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};


//update product by id

const updateProduct=async(req,res)=>{
    const id= req.params.id;                //req.params is an object in Express.js that contains route parameters extracted from the URL of the incoming HTTP request.
    const data=req.body;
    try{
        const updatedProduct=await product.findByIdAndUpdate(id,data,{new:true , runValidators:true});//new:true means return the updated data, runValidators:true means run the validators defined in the schema
        if(!updatedProduct){
            return res.status(404).json({message:"product not found"});
        } 
        res.status(200).json({message:"product updated successfully"});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};


//delete product by id
const deleteProduct= async(req,res)=>{
    const id=req.params.id;
    try{
      const deletedProduct=await product.findByIdAndDelete(id); 
      if(!deletedProduct){
        return res.status(404).json({message:"product not found"});
      }
      res.status(200).json({message:"product deleted successfully"});
    }
catch(err){
    res.status(500).json({message:err.message});
}
    
}

module.exports={
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
}
