const OfferModal = require('../models/Offer'); // Adjust the path to your model

// Create Offer
exports.createOffer = async (req, res) => {
    try {
        const { product, start_at, end_at, discount_percent, is_Active } = req.body;
        const newOffer = new OfferModal({ product, start_at, end_at, discount_percent, is_Active });
        await newOffer.save();

        res.status(201).json({
            success: true,
            data: newOffer,
            message: "Offer created successfully."
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message,
            message: "Failed to create offer."
        });
    }
};

// Get all Offers
exports.getOffers = async (req, res) => {
    try {
        const offers = await OfferModal.find().populate('product');
        res.status(200).json({
            success: true,
            data: offers
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message,
            message: "Failed to retrieve offers."
        });
    }
};

exports.getActiveOffers = async (req, res) => {
    try {
        const currentDate = new Date();
        const activeOffers = await OfferModal.find({
            is_Active: true,
            start_at: { $lte: currentDate },  // Offer with start_at less than or equal to the current date
            end_at: { $gte: currentDate },    // Offer with end_at greater than or equal to the current date
            start_at: { $exists: true },      // Offer with start_at exists
            end_at: { $exists: true }
        }).populate('product');

        res.status(200).json({
            success: true,
            data: activeOffers
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message,
            message: "Failed to retrieve active offers."
        });
    }
};


// Get Offer by ID
exports.getOfferById = async (req, res) => {
    try {
        const offer = await OfferModal.findById(req.params.id).populate('product');
        if (!offer) {
            return res.status(404).json({
                success: false,
                message: "Offer not found."
            });
        }
        res.status(200).json({
            success: true,
            data: offer
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message,
            message: "Failed to retrieve offer."
        });
    }
};

// Update Offer by ID
exports.updateOffer = async (req, res) => {
    try {
        const { product, start_at, end_at, discount_percent, is_Active } = req.body;
        const updatedOffer = await OfferModal.findByIdAndUpdate(req.params.id,
            { product, start_at, end_at, discount_percent, is_Active },
            { new: true }
        );

        if (!updatedOffer) {
            return res.status(404).json({
                success: false,
                message: "Offer not found."
            });
        }

        res.status(200).json({
            success: true,
            data: updatedOffer,
            message: "Offer updated successfully."
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message,
            message: "Failed to update offer."
        });
    }
};

// Delete Offer by ID (soft delete)
// exports.deleteOffer = async (req, res) => {
//     try {
//         const deletedOffer = await OfferModal.findByIdAndUpdate(req.params.id,
//             { deleted_at: new Date() },
//             { new: true }
//         );

//         if (!deletedOffer) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Offer not found."
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: deletedOffer,
//             message: "Offer deleted successfully."
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             error: err.message,
//             message: "Failed to delete offer."
//         });
//     }
// };


exports.deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteoffer = await OfferModal.findByIdAndDelete(id);

        if (!deleteoffer) {
            return res.status(404).json({
                success: 0,
                error: ['Offer  not found.'],
                data: null,
                message: 'Failed to delete Offer.'
            });
        }

        res.status(200).json({
            success: 1,
            error: [],
            data: null,
            message: 'Offerdeleted successfully.'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: 0,
            error: [err.message],
            data: null,
            message: 'Failed to delete Offer.'
        });
    }
};