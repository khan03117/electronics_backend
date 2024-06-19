const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var stockSchma = new mongoose.Schema({
    type: {
        type: String,
        enum: ['stock_in', 'stock_out'],
    },
    stock_date: {
        type: Date,
        index: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    varient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Varient"
    },
    qty: {
        type: Number
    },
});

//Export the model
module.exports = mongoose.model('Stock', stockSchma);