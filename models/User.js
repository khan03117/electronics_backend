const { Schema, default: mongoose } = require("mongoose");


const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    profile_image: {
        type: String
    },
    password: {
        type: String
    },
}, { timestamps: true });
module.exports = new mongoose.model('User', userSchema);