const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/products.routes");
const cartRoutes = require("./routes/cart.routes");
const categoryRoutes = require("./routes/categories.routes");
const endpointMap = require("./utils/endpointMap");

app.use(cors());
app.use(express.json());

// Route to display a map of all available endpoints
app.get("/", (req, res) => {
  res.status(200).json(endpointMap);
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/categories", categoryRoutes);

module.exports = app;
