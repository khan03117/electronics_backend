const express = require('express')
const store = require('../middleware/Upload');
const { _create, delete_testimonial, getall, update_data, show_control, getalladmin } = require('../controllers/TestimonialController');

const router = express.Router()

router.post('/', store.single('image'), _create)
router.delete('/:id', delete_testimonial);
router.get('/', getall)
router.get('/admin', getalladmin)
router.put('/:id', store.single('image'), update_data)
router.put('/show-control/:id', show_control)
module.exports = router;


