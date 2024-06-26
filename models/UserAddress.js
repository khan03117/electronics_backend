const { Schema, default: mongoose } = require("mongoose");


const addressSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    pincode: {
        type: String
    },
}, { timestamps: true });
module.exports = new mongoose.model('UserAddress', addressSchema);