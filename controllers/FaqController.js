const { validationResult } = require("express-validator");
const FaqModel = require('../models/Faq');

const _create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array(), success: 0 });
    }
    const { question, answer } = req.body;
    const data = new FaqModel({ question: question, answer: answer });
    await data.save().then((resp) => {
        return res.json({ data: resp, errors: errors, success: 1, message: "Faq created successfully." })
    })
}
const getAll = async (req, res) => {
    const items = await FaqModel.find({});
    return res.json({ data: items, errors: [], success: 1, message: "Fetched Faqs successfully." });
}

const destroy = async (req, res) => {
    if (!req.body.id) {
        return res.json({ data: [], errors: errors, success: 0, message: "Invalid faq id" });
    }
    const _id = req.body.id;
    await FaqModel.deleteOne({ _id: _id }).then((resp) => {
        return res.json({ data: [], errors: [], success: 1, message: " Faq deleted successfully." });
    })
}
const updatefaq = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array(), success: 0 });
    }
    const { faq_id, question, answer } = req.body;
    const faq = await FaqModel.findOne({ _id: faq_id });
    if (faq) {
        faq.question = question;
        faq.answer = answer;
        await faq.save();
        return res.json({ data: [], errors: [], success: 1, message: "faq updated successfully." });
    } else {
        return res.json({ data: [], errors: errors, success: 0, message: "Invalid faq id" });
    }
}

module.exports = {
    _create, getAll, destroy, updatefaq

}