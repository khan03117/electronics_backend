// models/DeliveryCharge.js

const mongoose = require('mongoose');

const deliveryChargeSchema = new mongoose.Schema({
    minPurchaseAmount: {
        type: Number,
        required: true
    },
    maxPurchaseAmount: {
        type: Number,
        required: true
    },
    deliveryType: {
        type: String,
        enum: ['standard', 'express', 'overnight'],
        required: true
    },
    charge: {
        type: Number,
        required: true
    }
});

const DeliveryCharge = mongoose.model('DeliveryCharge', deliveryChargeSchema);

module.exports = DeliveryCharge;
