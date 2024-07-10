const express = require('express');
const { _create, getall, _update, _destroy } = require('../controllers/SellerController');
const { AdminAuth } = require('../middleware/AdminAuth');
const store = require('../middleware/Upload');
const router = express.Router()
router.get('/', getall);
router.post('/', AdminAuth, store.single('image'), _create);
router.put('/:id', AdminAuth, store.single('image'), _update);
router.delete('/:id', AdminAuth, _destroy);
module.exports = router;