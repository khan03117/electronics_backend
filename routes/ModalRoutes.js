const express = require('express')
const { create_modal, modalgetall, modal_delete, modal_update, getmodal_bybrand } = require('../controllers/ModalController');
const store = require('../middleware/Upload');
const router = express.Router()



router.post('/', store.single('image'), create_modal)
router.get('/', modalgetall)
router.delete('/delete/:id', modal_delete)
router.put('/', store.single('image'), modal_update)
router.get('/:id', getmodal_bybrand)








module.exports = router;