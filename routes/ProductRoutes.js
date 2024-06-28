

const express = require('express')
const { createproduct, getallproduct, updateproduct, deleteproduct, get_products, get_product_by_id, recommended_products } = require('../controllers/ProductController')
const { body } = require('express-validator')
const Category = require('../models/Category')
const Brand = require('../models/Brand')
const Modal = require('../models/Modal')
const store = require('../middleware/Upload')
const router = express.Router()

const validation = [
    body('category').isMongoId().custom(async value => {
        const isExist = await Category.findOne({ _id: value })
        if (!isExist) {
            throw new Error('The Category does not Exist')
        }
    }),
    body('brand').isMongoId().custom(async value => {
        const isExist = await Brand.findOne({ _id: value })
        if (!isExist) {
            throw new Error('The Brand does not Exist')
        }
    }),
    body('modal').isMongoId().custom(async value => {
        const isExist = await Modal.findOne({ _id: value })
        if (!isExist) {
            throw new Error('The Modal does not Exist')
        }
    }),
]


router.post('/', store.array('images', 6), createproduct);
router.get('/shop', get_products);
router.get('/single-product/:id', get_product_by_id);
router.get('/', getallproduct)
router.put('/', updateproduct)
router.delete('/delete/:id', deleteproduct);
router.get('/recommended', recommended_products);






module.exports = router;


