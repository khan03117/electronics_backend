const { Schema, default: mongoose } = require("mongoose");
const orderSchema = new Schema({
    order_id: {
        type: String,

    },
    order_date: {
        type: Date,

    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user_address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAddress'
    },
    amount: {
        type: Number
    },
    status: {
        type: String,
        default: 'New Order'
    },


}, { timestamps: true });
module.exports = new mongoose.model('Order', orderSchema);