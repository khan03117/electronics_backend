const express = require('express');
const router = express.Router();
const controller = require('../controllers/CartController');
const { Auth } = require('../middleware/Auth');

router.post('/', Auth, controller._create);
router.get('/', Auth, controller.mycarts);


module.exports = router;