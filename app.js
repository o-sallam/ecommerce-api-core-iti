const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRoutes = require("./routes/auth.routes");
const productRoutes=require('./routes/products.routes');
const cartRoutes=require('./routes/cart.routes');

mongoose.connect(
    "mongodb+srv://admin:12345678iti@cluster0.ix3l1dd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => {
    console.log("Connected to MongoDB Atlas")
})
.catch((err) => {
    console.log(" MongoDB connection error", err)
});

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello');
});

//Routes
app.use('/auth', authRoutes);

app.use('/products', productRoutes); 
app.use('/cart', cartRoutes); 


app.listen(3000,() => {
    console.log('app is running in port 3000');
})


