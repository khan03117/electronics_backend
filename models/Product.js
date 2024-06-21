const { Schema, default: mongoose } = require("mongoose");


const pdschmea = new Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand"
    },
    modal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Modal"
    },
    product_type: {
        type: String
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    is_hidden: {
        type: Boolean,
        default: false
    },
    deleted_at: {
        type: Date
    },
}, { timestamps: true });

module.exports = new mongoose.model('Product', pdschmea)