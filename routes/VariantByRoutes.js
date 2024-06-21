

const express = require('express')


const { variantbygetall, variantbydelete, createVariantBy, updateVariantBy } = require('../controllers/VariantByController');
const { body } = require('express-validator');
const VariationBy = require('../models/VariationBy');

const router = express.Router();
const validation = [
    body('title').trim().notEmpty().custom(async value => {
        const isExists = await VariationBy.findOne({ title: value });
        if (isExists) {
            throw new Error('This variation already exits');
        }
    })
];

router.post('/', validation, createVariantBy)
router.get('/', variantbygetall)
router.delete('/delete/:id', variantbydelete)
router.put('/', updateVariantBy)


module.exports = router;


