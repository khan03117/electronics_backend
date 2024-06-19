const { Schema, default: mongoose } = require("mongoose");

const cateschema = new Schema({
    url: {
        type: String
    },
    image: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    is_hidden: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', cateschema);