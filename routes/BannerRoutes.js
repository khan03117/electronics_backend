const express = require('express')
const store = require('../middleware/Upload')
const { _create, delete_banner, getall, update_banner } = require('../controllers/BannerController')
const { AdminAuth } = require('../middleware/AdminAuth')
const router = express.Router()

router.post('/', AdminAuth, store.single('image'), _create)
router.delete('/:id', AdminAuth, delete_banner);
router.get('/', getall)
router.put('/:id', AdminAuth, store.single('image'), update_banner)
module.exports = router;