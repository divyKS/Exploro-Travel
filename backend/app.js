require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require("./db");

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trip');
const bookingRoutes = require('./routes/booking');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});