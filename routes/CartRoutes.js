const express = require('express');
const router = express.Router();
const controller = require('../controllers/CartController');
const { Auth } = require('../middleware/Auth');

router.post('/', Auth, controller._create);
router.post('/apply-promo', Auth, controller.apply_promo);
router.post('/checkout', Auth, controller.checkout);
router.get('/orders', Auth, controller.myorders);
router.get('/', Auth, controller.mycarts);
router.get('/product/:id', Auth, controller.cart_by_product);
router.delete('/:id', Auth, controller.delete_cart)

module.exports = router;