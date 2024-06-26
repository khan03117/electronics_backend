

const express = require('express')
const { body } = require('express-validator');
const Controller = require('../controllers/UserController');

const router = express.Router();
const validation = [
    body('mobile').trim().notEmpty()
];
const validation_otp = [
    body('mobile').trim().notEmpty(),
    body('otp').trim().notEmpty()
];

router.post('/send-otp', validation, Controller.send_otp)
router.post('/verify-otp', validation_otp, Controller.verify_otp)



module.exports = router;


