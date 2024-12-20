const { default: mongoose } = require("mongoose");
const Booking = require("../models/Booking");
const Trip = require("../models/Trip");
const { default: Cart } = require("../../frontend/src/components/Cart");

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

const checkoutFromCart = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.trip');
    if (!cart || cart.items.length === 0) {
      return res.status(400).send({ error: 'Cart is empty' });
    }

    // Verify all trips are still available
    for (const item of cart.items) {
      const trip = await Trip.findById(item.trip._id);
      if (!trip || trip.availableSlots < 1) {
        await session.abortTransaction();
        return res.status(400).send({ 
          error: `Trip ${trip.name} is no longer available` 
        });
      }
    }

    // Create bookings and update trip slots
    const bookings = [];
    for (const item of cart.items) {
      const trip = await Trip.findOneAndUpdate(
        { 
          _id: item.trip._id,
          availableSlots: { $gt: 0 }
        },
        { $inc: { availableSlots: -1 } },
        { session, new: true }
      );

      const booking = new Booking({
        trip: trip._id,
        user: req.user._id,
        paymentAmount: trip.price,
        status: 'confirmed',
        paymentStatus: 'completed'
      });

      await booking.save({ session });
      bookings.push(booking);
    }

    // Clear cart
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    res.status(201).send(bookings);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).send(error);
  } finally {
    session.endSession();
  }
}

module.exports = { createBooking, getBookings, cancelBooking, checkoutFromCart }