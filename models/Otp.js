const { Schema, default: mongoose } = require("mongoose");

const otpschema = new Schema({
    otp: {
        type: Number
    },
    mobile: {
        type: Number
    }
}, { timestamps: true });

module.exports = new mongoose.model('Otp', otpschema);