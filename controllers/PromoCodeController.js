const PromoCode = require('../models/PromoCode');




exports.createPromoCode = async (req, res) => {
    try {
        const { code_for, promo_code, user_count, start_at, end_at, discount, discount_type } = req.body;

        // Check if promo code already exists
        const existingPromoCode = await PromoCode.findOne({ promo_code });
        if (existingPromoCode) {
            return res.status(400).json({
                success: 0,
                error: ['Promo code already exists.'],
                data: null,
                message: 'Failed to create promo code.'
            });
        }

        const newPromoCode = new PromoCode({ code_for, promo_code, user_count, start_at, end_at, discount, discount_type });
        await newPromoCode.save();

        res.status(201).json({
            success: 1,
            error: [],
            data: newPromoCode,
            message: 'Promo code created successfully.'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: 0,
            error: [err.message],
            data: null,
            message: 'Failed to create promo code.'
        });
    }
};

exports.getPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.find();
        res.status(200).json({
            success: 1,
            error: [],
            data: promoCodes,
            message: 'Promo codes fetched successfully.'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: 0,
            error: [err.message],
            data: [],
            message: 'Failed to fetch promo codes.'
        });
    }
};




exports.updatePromoCode = async (req, res) => {
    try {
        const { id } = req.params;
        const { code_for, promo_code, user_count, start_at, end_at, discount, discount_type } = req.body;

        // Check if promo code already exists
        const existingPromoCode = await PromoCode.findOne({ promo_code });
        if (existingPromoCode && existingPromoCode._id.toString() !== id) {
            return res.status(400).json({
                success: 0,
                error: ['Promo code already exists.'],
                data: null,
                message: 'Failed to update promo code.'
            });
        }

        const updatedPromoCode = await PromoCode.findByIdAndUpdate(id, { code_for, promo_code, user_count, start_at, end_at, discount, discount_type }, { new: true });

        if (!updatedPromoCode) {
            return res.status(404).json({
                success: 0,
                error: ['Promo code not found.'],
                data: null,
                message: 'Failed to update promo code.'
            });
        }

        res.status(200).json({
            success: 1,
            error: [],
            data: updatedPromoCode,
            message: 'Promo code updated successfully.'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: 0,
            error: [err.message],
            data: null,
            message: 'Failed to update promo code.'
        });
    }
};


exports.deletePromoCode = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPromoCode = await PromoCode.findByIdAndDelete(id);

        if (!deletedPromoCode) {
            return res.status(404).json({
                success: 0,
                error: ['Promo code not found.'],
                data: null,
                message: 'Failed to delete promo code.'
            });
        }

        res.status(200).json({
            success: 1,
            error: [],
            data: null,
            message: 'Promo code deleted successfully.'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: 0,
            error: [err.message],
            data: null,
            message: 'Failed to delete promo code.'
        });
    }
};
