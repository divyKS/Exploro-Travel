const express = require('express');
const router = express.Router();
const  Booking  = require('../models/Booking');
const  Trip  = require('../models/Trip');
const { auth } = require('../middlewares/auth');
const { createBooking, getBookings, cancelBooking, checkoutFromCart } = require('../controllers/booking');


// Create booking
router.post('/', auth, createBooking);

// Get user's bookings
router.get('/my-bookings', auth, getBookings);

// Cancel booking
router.post('/:id/cancel', auth, cancelBooking);

// Checkout (create bookings from cart)
router.post('/checkout', auth, checkoutFromCart);

module.exports = router;