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

app.get("/", (req, res) => {
  res.send("Hello");
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
