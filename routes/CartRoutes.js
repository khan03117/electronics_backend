const express = require('express');
const router = express.Router();
const controller = require('../controllers/CartController');
router.post('/', controller._create);

module.exports = router;