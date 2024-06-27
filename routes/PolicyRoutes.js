const express = require('express');
const { _create, get_policies, get_policy } = require('../controllers/PolicyController');
const { body } = require("express-validator");
const validation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description of policy is required.')
];
const router = express.Router()

router.post('/', validation, _create)
router.get('/', get_policies);
router.get('/show/:url', get_policy)
module.exports = router;


