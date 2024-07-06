// controllers/deliveryChargeController.js

const { validationResult } = require('express-validator');
const DeliveryCharge = require('../models/DeliveryCharge');

// Create a new delivery charge
exports.createDeliveryCharge = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            success: 0,
            error: errors.array(),
            data: [],
            message: "Create new Brand failed"
        });
    }
    const { minPurchaseAmount, maxPurchaseAmount, deliveryType } = req.body;
    try {
        const existingCharges = await DeliveryCharge.find({
            deliveryType,
            $or: [
                {
                    minPurchaseAmount: { $lte: minPurchaseAmount },
                    maxPurchaseAmount: { $gte: minPurchaseAmount }
                },
                {
                    minPurchaseAmount: { $lte: maxPurchaseAmount },
                    maxPurchaseAmount: { $gte: maxPurchaseAmount }
                },
                {
                    minPurchaseAmount: { $gte: minPurchaseAmount },
                    maxPurchaseAmount: { $lte: maxPurchaseAmount }
                }
            ]
        });

        if (existingCharges.length > 0) {
            return res.status(400).send({ message: 'Delivery charge range overlaps with existing range' });
        }

        const deliveryCharge = new DeliveryCharge(req.body);
        await deliveryCharge.save();
        return res.json({
            success: 1,
            error: [],
            data: deliveryCharge,
            message: "New Delivery Charge created."
        });
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all delivery charges
exports.getAllDeliveryCharges = async (req, res) => {
    try {
        const deliveryCharges = await DeliveryCharge.find({});
        return res.json({
            success: 1,
            error: [],
            data: deliveryCharges,
            message: "All Delivery Charges"
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a delivery charge based on purchase amount and delivery type
exports.getDeliveryCharge = async (req, res) => {
    try {
        const { purchaseAmount, deliveryType } = req.query;
        const deliveryCharge = await DeliveryCharge.findOne({
            minPurchaseAmount: { $lte: purchaseAmount },
            maxPurchaseAmount: { $gte: purchaseAmount },
            deliveryType: deliveryType
        });

        if (!deliveryCharge) {
            return res.status(404).send({ message: 'No delivery charge found for the given criteria' });
        }
        return res.json({
            success: 1,
            error: [],
            data: deliveryCharge,
            message: "Delivery Charge Fetched"
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a delivery charge by ID
exports.updateDeliveryChargeById = async (req, res) => {
    try {
        const deliveryCharge = await DeliveryCharge.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!deliveryCharge) {
            return res.status(404).send();
        }
        return res.json({
            success: 1,
            error: [],
            data: deliveryCharge,
            message: "Delivery Charge Updated"
        });
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a delivery charge by ID
exports.deleteDeliveryChargeById = async (req, res) => {
    try {
        const deliveryCharge = await DeliveryCharge.findByIdAndDelete(req.params.id);
        if (!deliveryCharge) {
            return res.status(404).send();
        }
        res.status(200).send(deliveryCharge);
    } catch (error) {
        res.status(500).send(error);
    }
};
