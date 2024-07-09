const { Schema, default: mongoose } = require("mongoose");

const OfferSchema = new Schema({

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    start_at: {
        type: String
    },
    end_at: {
        type: String
    },
    discount_percent: {
        type: Number
    },
    is_Active: {
        type: Boolean,
        default: true
    },
    deleted_at: {
        type: Date
    },
}, { timestamps: true });

module.exports = new mongoose.model('Offer', OfferSchema);


