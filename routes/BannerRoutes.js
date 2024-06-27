const express = require('express')
const store = require('../middleware/Upload')
const { _create, delete_banner, getall, update_banner } = require('../controllers/BannerController')
const router = express.Router()

router.post('/', store.single('image'), _create)
router.delete('/:id', delete_banner);
router.get('/', getall)
router.put('/:id', store.single('image'), update_banner)
module.exports = router;


