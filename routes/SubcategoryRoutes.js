const express = require('express')
const store = require('../middleware/Upload');
const { createSubCategory, getSubCategories, getSubCategoryById, updateSubCategory, deleteSubCategory, getSubCategoriesByCategory } = require('../controllers/SubcategoryController');


const router = express.Router()


router.post('/', store.single('image'), createSubCategory);

router.get('/', getSubCategories);

router.get('/:id', getSubCategoryById);
router.get('/category/:categoryId', getSubCategoriesByCategory);
router.put('/:id', store.single('image'), updateSubCategory);



router.delete('/:id', deleteSubCategory);
module.exports = router;


