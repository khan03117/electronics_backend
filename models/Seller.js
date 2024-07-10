const { default: mongoose, Schema } = require("mongoose");
const sellerschema = new Schema({
    title: {
        type: String
    },
    url: {
        type: String
    },
    image: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerschema);