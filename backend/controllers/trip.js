const  cloudinary  = require('../middlewares/cloudinary');
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
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }
      
      const smallResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        {
          folder: 'trips/small',
          transformation: [
            { width: 300, height: 200, crop: 'fill' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        }
      );
  
      // Upload original/large version
      const largeResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        {
          folder: 'trips/large',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' }
          ]
        }
      );

      const trip = new Trip({
        ...req.body,
        organizer: req.user._id,
        availableSlots: req.body.totalSlots,
        images: {
          "small": {
            url: smallResult.secure_url,
            public_id: smallResult.public_id
          },
          "large": {
            url: largeResult.secure_url,
            public_id: largeResult.public_id
          }
        }
      });
      await trip.save();
      res.status(201).send(trip);
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Error processing image upload' });
    }
}

const editTrip = async (req, res) => {
  try {
      const updateData = { ...req.body };
      if (req.file) {  
        // Only process image if a new one was uploaded
        
        const existingTrip = await Trip.findOne({ _id: req.params.id, organizer: req.user._id });
        if(!existingTrip) return res.status(404).json({ error: 'Trip not found to be updated' });

        const oldBookingsDone = existingTrip.totalSlots - existingTrip.availableSlots;
        if(oldBookingsDone > updateData.totalSlots){
          return res.status(404).json({ error: 'You have more bookings done already than this updated no of total slots.' });
        }
        updateData.availableSlots = updateData.totalSlots - oldBookingsDone;

          
        if (existingTrip?.images) {          
          try {
            if (existingTrip.images.small?.public_id) {
              await cloudinary.uploader.destroy(existingTrip.images.small.public_id);
            }
            if (existingTrip.images.large?.public_id) {
              await cloudinary.uploader.destroy(existingTrip.images.large.public_id);
            }
          } catch (deleteError) {
            console.error('Error deleting old images:', deleteError);
          }
        }

        // Upload new images
        const smallResult = await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
          {
            folder: 'trips/small',
            transformation: [
              { width: 300, height: 200, crop: 'fill' },
              { quality: 'auto', fetch_format: 'auto' }
            ]
          }
        );

        const largeResult = await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
          {
            folder: 'trips/large',
            transformation: [
              { quality: 'auto', fetch_format: 'auto' }
            ]
          }
        );

        updateData.images = {
          small: {
            url: smallResult.secure_url,
            public_id: smallResult.public_id
          },
          large: {
            url: largeResult.secure_url,
            public_id: largeResult.public_id
          }
        };
    }


    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    // const updates = Object.keys(req.body);
    // updates.forEach(update => trip[update] = req.body[update]);
    // await trip.save();
    
    res.send(updatedTrip);
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