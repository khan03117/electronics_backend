const express = require("express");
const { body } = require("express-validator");
const FaqModel = require('../models/Faq');
const router = express.Router();

const validation = [
    body('question').trim().notEmpty().withMessage('Question is required.'),
    body('answer').trim().notEmpty().withMessage('Answer is required.'),
];
const controller = require('../controllers/FaqController');


router.post('/', validation, controller._create);
router.get('/', controller.getAll);
router.put('/:_id', controller.updatefaq);
router.delete('/:_id', controller.destroy);

module.exports = router;