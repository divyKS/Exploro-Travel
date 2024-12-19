const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { getUser, loginUser, registerUser } = require('../controllers/auth');

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile
router.get('/profile', auth, getUser);

module.exports = router;