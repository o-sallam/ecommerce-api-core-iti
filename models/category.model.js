const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  }]
});

module.exports = mongoose.model('Category', categorySchema)