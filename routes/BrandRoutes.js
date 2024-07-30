const express = require('express')
const { brand_create, brand_delete, brand_update, get_brandby_Category, brandgetall } = require('../controllers/BrandController')
const store = require('../middleware/Upload')

const { AdminAuth } = require('../middleware/AdminAuth')
const router = express.Router();

router.post('/', store.single('image'), brand_create);
router.delete('/delete/:brand_id', AdminAuth, brand_delete)
router.get('/', brandgetall)
router.put('/:id', AdminAuth, store.single('image'), brand_update)
router.get('/:id', AdminAuth, get_brandby_Category)
module.exports = router;


