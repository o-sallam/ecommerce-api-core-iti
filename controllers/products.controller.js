const product = require("../models/product.model");
const Category = require("../models/category.model");

//==================================================
// CREATE
//==================================================

// Create new product "for admins"
const createProduct = async (req, res) => {
  //createproduct built in in express
  const { name, price, image, description, categoryName } = req.body; //cause if i want to destructure the data i need to get from the body of the request // ex:{name}
  try {
    const category = await Category.findOne({ name: categoryName });

    // 1. Create the product and reference the category
    const newProduct = new product({
      name,
      price,
      image,
      description,
      category: category._id,
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "product created successfully", product: newProduct }); //201 status code for created //newProduct is the product that was created
  } catch (err) {
    res.status(400).json({ message: err.message }); //400 status code for bad request //err.message built in in error object
  }
};

// Adding bulk products (admins)
const addBulkProducts = async (req, res) => {
  try {
    // Accept either an array in the body directly **or** under `products`
    const payload = Array.isArray(req.body) ? req.body : req.body.products;

    if (!payload || !payload.length) {
      return res.status(400).json({ message: "No products provided" });
    }

    const processedProducts = [];
    for (const item of payload) {
      // Resolve the category ObjectId. Client can send `category` as an id or `categoryName` as a string
      let categoryId = item.category;
      if (!categoryId && item.categoryName) {
        const categoryDoc = await Category.findOne({
          name: item.categoryName.trim(),
        });
        if (!categoryDoc) {
          return res
            .status(400)
            .json({ message: `Category '${item.categoryName}' not found` });
        }
        categoryId = categoryDoc._id;
      }

      const productDoc = {
        name: item.name,
        price: item.price,
        description: item.description,
        category: categoryId,
        images: item.images,
        // Use explicit thumbnail if provided, otherwise default to first image
        thumbnail:
          item.thumbnail ||
          (item.images && item.images.length ? item.images[0] : undefined),
        featured: !!item.featured,
        quantity: item.quantity,
      };

      processedProducts.push(productDoc);
    }

    // Insert all documents at once. `ordered:false` means it will continue on validation errors of individual docs
    const createdProducts = await product.insertMany(processedProducts, {
      ordered: false,
    });

    res.status(201).json({
      message: "Products added successfully",
      count: createdProducts.length,
      products: createdProducts,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error adding products", error: err.message });
  }
};

//==================================================
// READ
//==================================================

// Get all products
const getAllProducts = async (req, res) => {
  try {
    let productList;
    if (req.query.page) {
      const page = parseInt(req.query.page);
      const capacity = 6; //how many products per page
      productList = await product
        .find()
        .skip((page - 1) * capacity)
        .limit(capacity);
    } else {
      productList = await product.find();
    }
    res.status(200).json(productList);
  } catch (err) {
    res.status(500).json({ message: err.message }); //500 status code for internal server error
  }
};

// Get a single product by id for product details page
const getSingleProduct = async (req, res) => {
  try {
    const id = req.params.id; //get the id from the request params
    const singleProduct = await product.findById(id); //findById built in func to get a single product by id
    const category = await Category.findOne({ _id: singleProduct.category }); //find the category by name
    if (!singleProduct) {
      return res.status(404).json({ message: "product not found" });
    }
    let { name, price, description, image } = singleProduct; //add the category name to the product object
    res
      .status(200)
      .json({ name, price, description, image, category: category.name }); //if product was found, return it
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await product.find({ featured: true });
    res.status(200).json(featuredProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRelatedProducts = async (req, res) => {
  try {
    const currentProductId = req.params.id;
    const currentProduct = await product.findById(currentProductId);

    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const relatedProducts = await product
      .find({
        category: currentProduct.category,
        _id: { $ne: currentProductId },
      })
      .sort({ sold: -1 })
      .limit(4);

    res.status(200).json(relatedProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//==================================================
// UPDATE
//==================================================

// Update product by id
const updateProduct = async (req, res) => {
  const id = req.params.id; //req.params is an object in Express.js that contains route parameters extracted from the URL of the incoming HTTP request.
  const data = req.body;
  try {
    const updatedProduct = await product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }); //new:true means return the updated data, runValidators:true means run the validators defined in the schema
    if (!updatedProduct) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json({ message: "product updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBulkProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const updatePromises = products.map(async (p) => {
      const { _id, ...updateData } = p;
      return await product.findByIdAndUpdate(_id, updateData, { new: true });
    });

    const updatedProducts = await Promise.all(updatePromises);

    res
      .status(200)
      .json({
        message: "Products updated successfully",
        products: updatedProducts,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAllProductImages = async (req, res) => {
  try {
    const allProducts = await product.find({});

    if (!allProducts.length) {
      return res.status(404).json({ message: "No products found to update." });
    }

    const bulkOps = allProducts.map((p) => {
      const imageName = p.name.replace(/\s+/g, "_").toLowerCase() + ".webp";
      const newImagePath = `assets/images/products-images/${imageName}`;
      return {
        updateOne: {
          filter: { _id: p._id },
          // Set the images array to contain only the new path, and update the thumbnail
          update: { $set: { images: [newImagePath], thumbnail: newImagePath } },
        },
      };
    });

    const result = await product.bulkWrite(bulkOps);

    res.status(200).json({
      message: "All product images updated successfully.",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error updating product images", error: err.message });
  }
};

//==================================================
// DELETE
//==================================================

// Delete product by id
const deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedProduct = await product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json({ message: "product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAllProducts = async (req, res) => {
  try {
    await product.deleteMany();
    res.status(200).json({ message: "products deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  // CREATE
  createProduct,
  addBulkProducts,
  // READ
  getAllProducts,
  getSingleProduct,
  getFeaturedProducts,
  getRelatedProducts,
  // UPDATE
  updateProduct,
  updateBulkProducts,
  updateAllProductImages,
  // DELETE
  deleteProduct,
  deleteAllProducts,
};
