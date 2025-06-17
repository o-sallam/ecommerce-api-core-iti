const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/products.routes");
const cartRoutes = require("./routes/cart.routes");
//const paymentRoutes=require('./routes/payment.routes');
const categoryRoutes = require("./routes/categories.routes");
const cors = require("cors");

mongoose
  .connect(
    "mongodb+srv://admin:12345678iti@cluster0.ix3l1dd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log(" MongoDB connection error", err);
  });

  app.use(cors());
app.use(express.json());

// Route to display a map of all available endpoints
app.get("/", (req, res) => {
  const routes = {
    "Endpoints": {
      "GET /": "Displays this endpoint map"
    },
    "Authentication": {
      "POST /auth/login": "User login. Expects {email, password} in body. Returns a JWT token.",
      "POST /auth/register": "User registration. Expects {username, email, password} in body."
    },
    "Users": {
      "GET /users": "Get all users."
    },
    "Products": {
      "GET /products": "Get all products.",
      "GET /products/:id": "Get a single product by ID.",
      "GET /products/related/:id": "Get products related to a product by ID.",
      "GET /products/featured": "Get all featured products.",
      "POST /products": "Create a new product.",
      "POST /products/bulk": "Add multiple products in bulk.",
      "PUT /products/:id": "Update a product by ID.",
      "PUT /products/bulk": "Update multiple products in bulk.",
      "PUT /products/images/update-all": "Update images for all products.",
      "DELETE /products": "Delete all products."
    },
    "Cart": {
      "GET /cart": "Get all carts.",
      "GET /cart/:id": "Get cart for a specific user by user ID.",
      "GET /cart/disproduct": "Display products in the cart.",
      "POST /cart/increase": "Increase quantity of a product in the cart.",
      "POST /cart/decrease": "Decrease quantity of a product in the cart.",
      "PUT /cart/edit/:id": "Edit an item in the cart by item ID.",
      "DELETE /cart/delete/:id": "Delete an item from the cart by item ID.",
      "DELETE /cart/deleteAll": "Delete all items from the cart."
    },
    "Categories": {
      "GET /categories": "Get all categories.",
      "POST /categories": "Create a new category."
    },
    "Payment": {
      "POST /payment/pay/fawry": "Endpoint for Fawry payment. (Note: The '/payment' route is currently disabled in app.js)"
    }
  };
  res.status(200).json(routes);
});
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
// app.use('/payment', paymentRoutes);
app.use("/categories", categoryRoutes);

app.listen(3000, () => {
  console.log("app is running in port 3000");
});
