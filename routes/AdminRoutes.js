const express = require('express');
const { update_contact_media, get_contact_media, login } = require('../controllers/AdminController');
const { body } = require('express-validator');
const router = express.Router()
const validation = [
    body('title').notEmpty().withMessage('title is required'),
    body('type').notEmpty().withMessage('type is required')
];
const validation2 = [
    body('email').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('password is required')
];
router.post('/contact-media', validation, update_contact_media)
router.get('/contact-media', get_contact_media);
router.post('/', validation2, login)

module.exports = router;


