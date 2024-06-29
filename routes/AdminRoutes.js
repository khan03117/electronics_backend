const express = require('express');
const { update_contact_media, get_contact_media } = require('../controllers/AdminController');
const { body } = require('express-validator');
const router = express.Router()
const validation = [
    body('title').notEmpty().withMessage('title is required'),
    body('type').notEmpty().withMessage('type is required')
];
router.post('/contact-media', validation,  update_contact_media)
router.get('/contact-media',  get_contact_media)

module.exports = router;


