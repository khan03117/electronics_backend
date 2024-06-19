const express = require('express');
const router = express.Router();
const controller = require('../controllers/CategoryController');
const store = require('../middleware/Upload');
router.post('/', store.single('image'), controller._create);
router.get('/', controller._get_all);
router.delete('/', controller._delete);
module.exports = router;