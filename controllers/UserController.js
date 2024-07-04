const { validationResult } = require("express-validator");
const User = require("../models/User");
const Otp = require("../models/Otp");
// const { creatJWT } = require("../middleware/CreateToken");
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const send_otp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            errors: errors.array(),
            success: 0,
            message: "Validation failed",
            data: []
        });
    }
    const { mobile } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000);
    await Otp.create({ mobile: mobile, otp: otp });
    const isExists = await User.findOne({ mobile: mobile });
    return res.json({
        errors: errors.array(),
        success: 1,
        message: "Otp Sent successfully to your mobile",
        data: [],
        isExists: isExists ? '1' : '0',
        otp: otp
    });

}

const verify_otp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            errors: errors.array(),
            success: 0,
            message: "Validation failed",
            data: []
        });
    }
    const { mobile, otp } = req.body;
    const fdata = {
        mobile: mobile,
        otp: otp
    }
    const isVerified = await Otp.findOne(fdata);
    if (isVerified) {
        await Otp.deleteOne({ _id: isVerified._id });
        const isExists = await User.findOne({ mobile: mobile });
        if (!isExists) {
            await User.create({ mobile: mobile })
        }
        const exists_user = await User.findOne({ mobile: mobile });
        const token = jwt.sign({ user_id: exists_user._id }, "frantic@electronics#9090", { expiresIn: "30 days" });
        return res.json({
            errors: errors.array(),
            success: 1,
            message: "Otp verified successfully",
            data: token
        });

    } else {
        return res.json({
            errors: errors.array(),
            success: 0,
            message: "Invalid OTP",
            data: []
        });
    }
}
const profile = async (req, res) => {
    const user = await User.findOne({ _id: req.user });
    return res.json({
        errors: [],
        success: 0,
        message: "User profile",
        data: user
    });
}

module.exports = {
    send_otp, verify_otp, profile
}