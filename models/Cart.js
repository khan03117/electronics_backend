const { Schema, default: mongoose } = require("mongoose");
const cartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        default: null
    },
    modal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Modal',
        default: null
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    is_ordered: {
        type: Boolean,
        default: false
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: null
    }
}, { timestamps: true });
module.exports = new mongoose.model('Cart', cartSchema);