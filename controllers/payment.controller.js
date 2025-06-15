const axios = require('axios');
const crypto = require('crypto');
const Order = require('../models/Order');
const { env } = require('process');

exports.createFawryPayment = async (req, res) => {
  const { customerName, email, phone, amount } = req.body;

  const merchantCode = process.env.MERCHANT_CODE;
  const secureKey = process.env.SECURE_KET;
  const merchantRefNum = 'ORD-' + Date.now();

  const signatureString = merchantCode + merchantRefNum + email + amount + 'EGP' + secureKey;
  const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

  const fawryData = {
    merchantCode,
    merchantRefNumber: merchantRefNum,
    customerProfileId: email,
    paymentMethod: 'PAYATFAWRY',
    amount,
    currencyCode: 'EGP',
    description: 'Order from Angular Checkout',
    signature,
    chargeItems: [
      {
        itemId: 'ITEM1',
        description: 'Test Product',
        price: amount,
        quantity: 1
      }
    ]
  };

  try {
    const response = await axios.post('https://www.atfawry.com/ECommerceWeb/Fawry/payments/init', fawryData);
    const order = new Order({
      customerName,
      email,
      phone,
      amount,
      fawryRefNumber: response.data.fawryRefNumber
    });

    await order.save();

    res.status(200).json({
      message: 'Fawry reference generated successfully',
      fawryRefNumber: response.data.fawryRefNumber
    });
  } catch (err) {
    console.error('Fawry error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to initiate payment with Fawry' });
  }
};
