const mongoose = require('mongoose');

const PromoCodeSchema = new mongoose.Schema({
    code_for: { type: String, required: true }, // Ensure code_for is required if it's essential
    promo_code: { type: String, required: true, unique: true }, // Ensure promo_code is required and unique
    user_count: { type: Number, default: 0 }, // Provide a default value if needed
    start_at: { type: Date, default: Date.now }, // Use Date.now for default if start_at is not specified
    end_at: { type: Date }, // You might want to enforce an end date if necessary,
    discount: { type: Number },
    discount_type: { type: String }
});

module.exports = mongoose.model('PromoCode', PromoCodeSchema);
