const { Schema, default: mongoose } = require("mongoose");


const testimonialschema = new Schema({
    name: {
        type: String
    },
    image: {
        type: String
    },
    subject: {
        type: String
    },
    location: {
        type: String
    },
    rating: {
        type: String
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    description: {
        type: String
    },
    is_hidden: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
module.exports = new mongoose.model('Testimonial', testimonialschema);