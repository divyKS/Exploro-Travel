const express = require('express');
const router = express.Router();
const { auth, isOrganizer } = require('../middlewares/auth');
const { getAllTrips, getTrip, createTrip, editTrip, deleteTrip } = require('../controllers/trip');

// Get all trips
router.get('/', getAllTrips);

// Get single trip
router.get('/:id', getTrip);

// Create trip (organizers only)
router.post('/', auth, isOrganizer, createTrip);

// Update trip (organizers only)
router.patch('/:id', auth, isOrganizer, editTrip);

// Delete trip (organizers only)
router.delete('/:id', auth, isOrganizer, deleteTrip);

module.exports = router;