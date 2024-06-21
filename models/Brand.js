const { Schema, default: mongoose } = require("mongoose");

const brandschema = new Schema({
    url: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    title: {
        type: String
    },
    is_hidden: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },
    deleted_at: {
        type: Date
    },

}, { timestamps: true });
module.exports = mongoose.model('Brand', brandschema);