const express = require('express');
const { createOffer, getOffers, getOfferById, updateOffer, deleteOffer, getActiveOffers } = require('../controllers/OfferController');

const router = express.Router()

router.post('/', createOffer);


router.get('/', getOffers);

router.get('/active', getActiveOffers);


router.get('/:id', getOfferById);

// PUT /api/offers/:id - Update an offer by ID
router.put('/:id', updateOffer);

// DELETE /api/offers/:id - Delete an offer by ID (soft delete)
router.delete('/:id', deleteOffer);
module.exports = router;


