const express = require('express')
const { create_modal, modalgetall, modal_delete, modal_update, getmodal_bybrand, getModalsByBrands } = require('../controllers/ModalController');
const store = require('../middleware/Upload');
const router = express.Router()



router.post('/', create_modal)
router.get('/', modalgetall)
router.delete('/delete/:id', modal_delete)
router.put('/:id', store.single('image'), modal_update)
router.get('/brand/:id', getmodal_bybrand);









module.exports = router;