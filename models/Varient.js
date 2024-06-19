const { Schema, default: mongoose } = require("mongoose");

const detailsSchema = {
    variationBy: {
        type: mongoose.Schema.type.ObjectId,
        ref: "VariatioinBy"
    },
    variation: {
        type: String
    }
}
const imageSchma = {
    title: {
        type: String
    }
}
const vrientschmea = new Schema({
    url: {
        type: String
    },
    type: {
        type: String
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    details: [detailsSchema],
    images: [imageSchma],
    mrp: {
        type: Number
    },
    price: {
        type: Number
    },
    discount: {
        type: Number
    },
    discount_unit: {
        type: String
    },
    deleted_at: {
        type: Date
    }
}, { timestamps: true });


module.exports = new mongoose.model('Varient', vrientschmea);