const { Schema, default: mongoose } = require("mongoose");


const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true, // Ensuring the email field is unique
        required: true //

    },
    mobile: {
        type: String,
        unique: true, // Ensuring the email field is unique
        required: true //
    },
    password: {
        type: String
    },
}, { timestamps: true });
module.exports = new mongoose.model('Admin', userSchema);