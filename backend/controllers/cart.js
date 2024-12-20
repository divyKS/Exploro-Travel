const Cart = require('../models/Cart');
const Trip = require('../models/Trip');

const addItem = async (req, res) => {
    try {
      const { tripId } = req.body;
      
      // Verify trip exists and has available slots
      const trip = await Trip.findById(tripId);
      if (!trip || trip.availableSlots < 1) {
        return res.status(400).send({ error: 'Trip not available' });
      }
  
      // Get or create cart
      let cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
      }
  
      // Check if trip already in cart
      if (cart.items.some(item => item.trip.toString() === tripId)) {
        return res.status(400).send({ error: 'Trip already in cart' });
      }
  
      cart.items.push({ trip: tripId });
      await cart.save();
  
      // Populate trip details
      await cart.populate('items.trip');
      res.send(cart);
    } catch (error) {
      res.status(400).send(error);
    }
}

const getCartItems = async (req, res) => {
    try {
      let cart = await Cart.findOne({ user: req.user._id }).populate('items.trip');
      if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
        await cart.save();
      }
      res.send(cart);
    } catch (error) {
      res.status(400).send(error);
    }
}

const removeItem = async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        return res.status(404).send({ error: 'Cart not found' });
      }
  
      cart.items = cart.items.filter(item => item.trip.toString() !== req.params.tripId);
      await cart.save();
      await cart.populate('items.trip');
      res.send(cart);
    } catch (error) {
      res.status(400).send(error);
    }
}

module.exports = { addItem, getCartItems, removeItem }