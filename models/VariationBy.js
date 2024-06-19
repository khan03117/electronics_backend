const { Schema, default: mongoose } = require("mongoose");

const variationbyschmea = new Schema({
    title: {
        type: String
    }

}, { timestamps: true })

module.exports = new mongoose.model('VariationBy', variationbyschmea);