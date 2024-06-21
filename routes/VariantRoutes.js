const express = require('express');
const { getallvariant, createVariant } = require('../controllers/VariantController');
const store = require('../middleware/Upload');

const router = express.Router()

router.get('/', getallvariant)
router.post('/', store.array('images', 5), createVariant)


module.exports = router;
