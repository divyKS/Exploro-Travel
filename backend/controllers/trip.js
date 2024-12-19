const  Trip  = require('../models/Trip');

const getAllTrips = async (req, res) => {
    try {
      const trips = await Trip.find().populate('organizer', 'name email');
      res.send(trips);
    } catch (error) {
      res.status(500).send(error);
    }
}

const getTrip = async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.id).populate('organizer', 'name email');
      if (!trip) {
        return res.status(404).send();
      }
      res.send(trip);
    } catch (error) {
      res.status(500).send(error);
    }
}

const createTrip = async (req, res) => {
    try {
      const trip = new Trip({
        ...req.body,
        organizer: req.user._id,
        availableSlots: req.body.totalSlots
      });
      await trip.save();
      res.status(201).send(trip);
    } catch (error) {
      res.status(400).send(error);
    }
}

const editTrip = async (req, res) => {
    try {
      const trip = await Trip.findOne({ _id: req.params.id, organizer: req.user._id });
      if (!trip) {
        return res.status(404).send();
      }
  
      const updates = Object.keys(req.body);
      updates.forEach(update => trip[update] = req.body[update]);
      await trip.save();
      res.send(trip);
    } catch (error) {
      res.status(400).send(error);
    }
}

const deleteTrip = async (req, res) => {
    try {
      const trip = await Trip.findOneAndDelete({ _id: req.params.id, organizer: req.user._id });
      if (!trip) {
        return res.status(404).send();
      }
      res.send(trip);
    } catch (error) {
      res.status(500).send(error);
    }
}

module.exports = { getAllTrips, getTrip, createTrip, editTrip, deleteTrip }