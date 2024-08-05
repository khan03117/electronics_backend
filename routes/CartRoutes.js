const express = require('express');
const router = express.Router();
const controller = require('../controllers/CartController');
const { Auth } = require('../middleware/Auth');

router.post('/', Auth, controller._create);
router.post('/apply-promo', Auth, controller.apply_promo);
router.post('/checkout', Auth, controller.checkout);
router.post('/wishlist', Auth, controller.add_to_wishlist);
router.get('/wishlist', Auth, controller.get_wishlist);
router.get('/wishlist/:product_id', Auth, controller.check_wishlist);
router.get('/orders', Auth, controller.myorders);
router.get('/', Auth, controller.mycarts);
router.get('/viewall', controller.mycart);
router.get('/product/:id', Auth, controller.cart_by_product);
router.get('/cart_count', Auth, controller.cart_count);
router.delete('/:id', Auth, controller.delete_cart)

module.exports = router;