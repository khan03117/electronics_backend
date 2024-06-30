const express = require('express')
const { brand_create, brand_delete, brand_update, get_brandby_Category, brandgetall } = require('../controllers/BrandController')
const store = require('../middleware/Upload')
const router = express.Router()

router.post('/', store.single('image'), brand_create)
router.delete('/delete/:brand_id', brand_delete)
router.get('/', brandgetall)
router.put('/:id', store.single('image'), brand_update)
router.get('/:id', get_brandby_Category)
module.exports = router;


