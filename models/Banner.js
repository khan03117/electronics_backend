const { Schema, default: mongoose } = require("mongoose");

const bannerSchema = new Schema({

    image: {
        type: String
    },

    type: {
        type: String,
        default: 'Banner'
    }

}, { timestamps: true });
module.exports = mongoose.model('Banner', bannerSchema);