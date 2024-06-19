const { Schema, default: mongoose } = require("mongoose");

const pdschmea = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    is_hidden: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = new mongoose.model('Product', pdschmea)