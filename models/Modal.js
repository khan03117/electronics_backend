const { Schema, default: mongoose } = require("mongoose");

const modalschema = new Schema({
    url: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand"
    },
    title: {
        type: String
    },
    image: {
        type: String
    },
    is_hidden: {
        type: Boolean,
        default: false
    },
    deleted_at: {
        type: Date
    },
}, { timestamps: true });

module.exports = new mongoose.model('Modal', modalschema);