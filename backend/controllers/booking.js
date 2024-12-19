const Booking = require("../models/Booking");
const Trip = require("../models/Trip");

const createBooking = async (req, res) => {
    try {
      const trip = await Trip.findById(req.body.tripId);
      if (!trip) {
        return res.status(404).send({ error: 'Trip not found' });
      }
  
      if (trip.availableSlots < 1) {
        return res.status(400).send({ error: 'No available slots' });
      }
  
      const booking = new Booking({
        trip: trip._id,
        user: req.user._id,
        paymentAmount: trip.price
      });
  
      trip.availableSlots -= 1;
      await Promise.all([booking.save(), trip.save()]);
      
      res.status(201).send(booking);
    } catch (error) {
      res.status(400).send(error);
    }
}

const getBookings = async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.user._id })
        .populate('trip')
        .sort({ bookingDate: -1 });
      res.send(bookings);
    } catch (error) {
      res.status(500).send(error);
    }
}

const cancelBooking = async (req, res) => {
    try {
      const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
      if (!booking) {
        return res.status(404).send();
      }
  
      const trip = await Trip.findById(booking.trip);
      const today = new Date();
      const tripDate = new Date(trip.startDate);
      const daysUntilTrip = Math.ceil((tripDate - today) / (1000 * 60 * 60 * 24));
  
      let refundAmount = 0;
      if (daysUntilTrip >= 15) {
        refundAmount = booking.paymentAmount;
      } else if (daysUntilTrip >= 7) {
        refundAmount = booking.paymentAmount * 0.5;
      }
  
      booking.status = 'cancelled';
      booking.paymentStatus = refundAmount > 0 ? 'refunded' : 'completed';
      trip.availableSlots += 1;
  
      await Promise.all([booking.save(), trip.save()]);
      res.send({ booking, refundAmount });
    } catch (error) {
      res.status(400).send(error);
    }
  }

module.exports = { createBooking, getBookings, cancelBooking }