// Vercel/Serverless compatible Express app
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/products.routes");
const cartRoutes = require("./routes/cart.routes");
const categoryRoutes = require("./routes/categories.routes");
const endpointMap = require("./utils/endpointMap");
const authenticateToken = require("./controllers/auth.middleware");

// Ensure DB is connected for every serverless invocation
connectDB();

app.use(
  cors({
    origin: [
      "https://ecommerce-api-core-iti.vercel.app",
      "http://localhost:4200",
    ],
    credentials: true, // set to true only if you need cookies/auth
  })
);
app.use(express.json());

// Route to display a map of all available endpoints
app.get("/", (_, res) => {
  res.status(200).json(endpointMap);
});

app.use("/auth", authRoutes);
app.use("/users", /*authenticateToken, */ userRoutes);
app.use("/products", /*authenticateToken, */ productRoutes);
app.use("/cart", /*authenticateToken, */ cartRoutes);
app.use("/categories", /*authenticateToken, */ categoryRoutes);

// Export for Vercel serverless
module.exports = app;
