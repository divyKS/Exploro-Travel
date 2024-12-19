const mongoose = require('mongoose');
const Booking = require("./Booking");

const tripSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    totalSlots: {
        type: Number,
        required: true
    },
    availableSlots: {
        type: Number,
        required: true
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [{
        type: String
    }],
    location: {
        type: String,
        required: true
    }
});

tripSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Booking.deleteMany({ trip: doc._id });
  }
});
  
module.exports = mongoose.model('Trip', tripSchema);
  