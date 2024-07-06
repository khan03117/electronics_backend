const express = require('express');

const { body } = require("express-validator");
const { createDeliveryCharge } = require('../controllers/deliveryChargeController');
const validation = [
    body('minPurchaseAmount').notEmpty().withMessage('Min amount is required'),
    body('maxPurchaseAmount').notEmpty().withMessage('Description of policy is required.')
];
const router = express.Router()

router.post('/', createDeliveryCharge)
router.get('/', get_policies);
router.get('/show/:url', get_policy)
module.exports = router;
