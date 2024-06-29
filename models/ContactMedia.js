const { default: mongoose, Schema } = require("mongoose");

const ContactMediaSchema = new Schema({
    title : {
        type : String
    },
    type : {
        type : String,
        enum : ['Contact', 'Social']
    },
    media_value : {
        type : String
    },
    show_in_app : {
        type: Boolean,
        default : true
    }
}, { timestamps: true });


module.exports = mongoose.model('ContactMedia', ContactMediaSchema);