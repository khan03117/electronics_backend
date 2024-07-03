const { Schema, default: mongoose } = require("mongoose");

const SubcategorySchema = new Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
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

module.exports = mongoose.model('SubCategory', SubcategorySchema);