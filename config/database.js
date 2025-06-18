require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(
      process.env.MONGO_URI ||
        "mongodb+srv://admin:12345678iti@cluster0.ix3l1dd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
      console.log("Connected to MongoDB Atlas");
    })
    .catch((err) => {
      console.log(" MongoDB connection error", err);
      process.exit(1);
    });
};

module.exports = connectDB;
