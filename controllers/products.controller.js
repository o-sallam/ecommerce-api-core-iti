const product = require('../models/products.models');
const Category = require('../models/category.model');

//create new product "for admins"

const createProduct = async (req, res) => { //createproduct built in in express 
    const { name, price, image, description, categoryName } = req.body;             //cause if i want to destructure the data i need to get from the body of the request // ex:{name}
    try {

        const category = await Category.findOne({ name: categoryName });

        // 1. Create the product and reference the category
        const newProduct = new product({
            name,
            price,
            image,
            description,
            category: category._id
        });
        await newProduct.save();
        res.status(201).json({ message: "product created successfully", product: newProduct }); //201 status code for created //newProduct is the product that was created
    }
    catch (err) {
        res.status(400).json({ message: err.message }); //400 status code for bad request //err.message built in in error object 

    }
};

//get all products
const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page); //pagination //get the page number from the query string
        const capacity = 6;                    //how many products per page
        const productList = await product.find().skip((page - 1) * capacity).limit(capacity); //find built in func to get all products
        res.status(200).json(productList);
    }
    catch (err) {
        res.status(500).json({ message: err.message }); //500 status code for internal server error

    }
};

//adding bulk products
const addBulkProducts = async (req, res) => {
    try{
    const productsArray = req.body.products;  //get the products array from the request body
    const processedProducts=[];               //array to hold the processed products before saving them to the database
    for (let item of productsArray){
        let category = await Category.findOne({name: item.categoryName}); //find the category by name
        if(!category){                                           //if the category does not exist, create it
             category = await Category.create({ name: item.categoryName });
        }
        const newProduct = new product({           //create a new product object
        name: item.name,
        price: item.price,
        image: item.image,
        description: item.description,
        inStock: item.inStock ?? true,
        category: category._id
        });
        processedProducts.push(newProduct);        //push the new product to the processed products array

    }
    await product.insertMany(processedProducts);    //insertMany built in func to insert multiple products at once
    res.status(201).json({ message: "Products added successfully", count: processedProducts.length });

    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Error adding products", error: err.message });
    }
}

//get a single product by id  for product details page
const getSingleProduct = async (req, res) => {
    try {
        const id = req.params.id;                                  //get the id from the request params
        const singleProduct = await product.findById(id);      //findById built in func to get a single product by id
        const category = await Category.findOne({ _id: singleProduct.category }); //find the category by name
        if (!singleProduct) {
            return res.status(404).json({ message: "product not found" });
        }
        let{name,price,description,image} = singleProduct; //add the category name to the product object
        res.status(200).json({name,price,description,image,category:category.name});      //if product was found, return it

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//update product by id

const updateProduct = async (req, res) => {
    const id = req.params.id;                //req.params is an object in Express.js that contains route parameters extracted from the URL of the incoming HTTP request.
    const data = req.body;
    try {
        const updatedProduct = await product.findByIdAndUpdate(id, data, { new: true, runValidators: true });//new:true means return the updated data, runValidators:true means run the validators defined in the schema
        if (!updatedProduct) {
            return res.status(404).json({ message: "product not found" });
        }
        res.status(200).json({ message: "product updated successfully" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//delete product by id
const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedProduct = await product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "product not found" });
        }
        res.status(200).json({ message: "product deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

} 


module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    addBulkProducts
}
