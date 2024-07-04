const express = require('express');
const { createOffer, getOffers, getOfferById, updateOffer, deleteOffer } = require('../controllers/OfferController');

const router = express.Router()

router.post('/', createOffer);


router.get('/', getOffers);


router.get('/:id', getOfferById);

// PUT /api/offers/:id - Update an offer by ID
router.put('/:id', updateOffer);

// DELETE /api/offers/:id - Delete an offer by ID (soft delete)
router.delete('/:id', deleteOffer);
module.exports = router;


