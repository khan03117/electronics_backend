const { Schema, default: mongoose } = require("mongoose");

const bannerSchema = new Schema({

    image: {
        type: String
    },
    url: {
        type: String
    },
    type: {
        type: String,
        default: 'home'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        default: null
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    },
    heading: {
        type: String
    },
    text: {
        type: String
    }

}, { timestamps: true });
module.exports = mongoose.model('Banner', bannerSchema);