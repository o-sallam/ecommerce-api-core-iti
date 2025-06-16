// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   customerName: {type:String,required:true},
//   email: {type:String,required:true,unique:true},
//   phone: {type:String,required:true,unique:true},
//   amount: {type:Number,required:true},
//   fawryRefNumber: {type:String,req},
//   status: { type: String, default: 'pending' } 
// }, { timestamps: true });

// module.exports = mongoose.model('Order', orderSchema);


const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  method: { type: String, enum: ['fawry', 'visa', 'cash'], required: true },
  providerRef: String,      
  amount: Number,
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  responsePayload: Object,   
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);