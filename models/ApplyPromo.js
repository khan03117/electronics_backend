const mongoose = require('mongoose');

const applypromoschema = new mongoose.Schema({
    promo_code: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PromoCode'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    discount: { type: Number },
    order_placed: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('ApplyPromo', applypromoschema);
