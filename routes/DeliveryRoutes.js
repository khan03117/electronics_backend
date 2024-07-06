const express = require('express');

const { body } = require("express-validator");
const { createDeliveryCharge, getAllDeliveryCharges, getDeliveryCharge } = require('../controllers/deliveryChargeController');
const validation = [
    body('minPurchaseAmount').notEmpty().withMessage('Min amount is required'),
    body('maxPurchaseAmount').notEmpty().withMessage('Description of policy is required.')
];
const router = express.Router()

router.post('/', validation, createDeliveryCharge)
router.get('/', getAllDeliveryCharges);
router.get('/find', getDeliveryCharge)
module.exports = router;
