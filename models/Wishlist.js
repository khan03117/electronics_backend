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
        ref: 'Brand'
    },
    modal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Modal'
    }

}, { timestamps: true });
module.exports = new mongoose.model('Wishlist', cartSchema);