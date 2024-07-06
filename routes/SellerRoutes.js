const express = require('express');
const { _create, getall, _update, _destroy } = require('../controllers/SellerController');
const { AdminAuth } = require('../middleware/AdminAuth');
const router = express.Router()
router.get('/', getall);
router.post('/', AdminAuth, _create);
router.put('/:id', AdminAuth, _update);
router.delete('/:id', AdminAuth, _destroy);
module.exports = router;