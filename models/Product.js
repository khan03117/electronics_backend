const { Schema, default: mongoose } = require("mongoose");


const modalsschema = {
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        default: null
    },
    modal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Modal",
        default: null
    },
    moq: {
        type: Number
    },
    stock: {
        type: Number
    }
}
const pdschmea = new Schema({
    url: {
        type: String,
        unique: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        default : null,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        default : null,
    },
    product_type: {
        type: String
    },
    title: {
        type: String,
    },
    price: {
        type: Number
    },
    mrp: {
        type: Number
    },
    moq: {
        type: Number,
        default: 1
    },
    stock: {
        type: Number,
        default: 1
    },
    images: [String],
    modals: [modalsschema],
    total_moq: {
        type: Number
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