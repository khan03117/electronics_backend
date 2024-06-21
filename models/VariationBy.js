

const { Schema, default: mongoose } = require("mongoose");

const variationBySchema = new Schema({
    title: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('VariationBy', variationBySchema);
