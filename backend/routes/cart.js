const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');

const { addItem, getCartItems, removeItem } = require('../controllers/cart');

// Add item to cart
router.post('/add', auth, addItem);

// Get cart
router.get('/', auth, getCartItems);

// Remove item from cart
router.delete('/items/:tripId', auth, removeItem);

module.exports = router;