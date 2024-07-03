const express = require('express')
const store = require('../middleware/Upload');
const { createSubCategory, getSubCategories, getSubCategoryById, updateSubCategory, deleteSubCategory } = require('../controllers/SubcategoryController');


const router = express.Router()


router.post('/', store.single('image'), createSubCategory);

router.get('/', getSubCategories);

router.get('/:id', getSubCategoryById);

router.put('/:id', store.single('image'), updateSubCategory);

router.delete('/:id', deleteSubCategory);
module.exports = router;


