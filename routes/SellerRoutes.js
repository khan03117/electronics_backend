const express = require('express');
const { _create, getall, _update, _destroy } = require('../controllers/SellerController');
const router = express.Router()
router.get('/', getall);
router.post('/', _create);
router.put('/:id', _update);
router.delete('/:id', _destroy);
module.exports = router;