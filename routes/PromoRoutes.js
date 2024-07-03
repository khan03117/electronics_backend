const express = require('express');
const { getPromoCodes, createPromoCode, updatePromoCode, deletePromoCode } = require('../controllers/PromoCodeController');


const router = express.Router()



router.get('/', getPromoCodes);
router.post('/', createPromoCode);
router.put('/:id', updatePromoCode);
router.delete('/:id', deletePromoCode);
module.exports = router;


