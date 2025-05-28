const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(
    "mongodb+srv://admin:12345678iti@cluster0.ix3l1dd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => {
    console.log("Connected to MongoDB Atlas")
})
.catch((err) => {
    console.log(" MongoDB connection error", err)
});

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(3000,() => {
    console.log('app is running in port 3000');
})