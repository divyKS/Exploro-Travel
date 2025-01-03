import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrganizerDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createTripLoading, setCreateTripLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    price: '',
    totalSlots: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const { user } = useAuth()

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await axios.get('http://localhost:3500/api/trips');
      const organizerTrips = response.data.filter(
        trip => trip.organizer._id === user._id
      );
      setTrips(organizerTrips);
    } catch (error) {
      setError('Error fetching trips');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      price: '',
      totalSlots: ''
    });
    setEditingTrip(null);
    setShowForm(false);
  };

  const handleEditClick = (trip) => {
    // Format dates to YYYY-MM-DD for input type="date"
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    setFormData({
      name: trip.name,
      description: trip.description,
      location: trip.location,
      startDate: formatDate(trip.startDate),
      endDate: formatDate(trip.endDate),
      price: trip.price,
      totalSlots: trip.totalSlots
    });
    setEditingTrip(trip._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateTripLoading(true);
    try {
      const data = new FormData();
      
      data.append('tripImage', selectedImage);
      
      for (let key in formData) {
        data.append(key, formData[key]);
      }
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      if (editingTrip) {
        await axios.patch(`http://localhost:3500/api/trips/${editingTrip}`, data, config);
      } else {
        await axios.post('http://localhost:3500/api/trips', data, config);
      }
      resetForm();
      fetchTrips();
    } catch (error) {
      setError(editingTrip ? 'Error updating trip' : 'Error creating trip');
    } finally {
      setCreateTripLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await axios.delete(`http://localhost:3500/api/trips/${tripId}`);
        fetchTrips();
      } catch (error) {
        setError('Error deleting trip');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Add New Trip'}
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Trip Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Total Slots</label>
              <input
                type="number"
                name="totalSlots"
                value={formData.totalSlots}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div>
            <label
              className="block mb-1"
              htmlFor="tripImage"
            >
              Trip Image
            </label>
            <input
              type="file"
              id="tripImage"
              accept="image/*"
              className="w-full p-2 border rounded"
              onChange={handleImageChange}
            />
        </div>
          <div className="mt-4">
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            className={`mt-4 text-white px-4 py-2 rounded ${createTripLoading ? `bg-gray-500` : `bg-blue-500 hover:bg-blue-600`}`}
          >
            {editingTrip ? 'Edit Trip' : createTripLoading ? 'Creating...' : 'Create Trip'}
          </button>
        </form>
      )}

    <div className="space-y-4">
        {trips.map((trip) => (
          <div key={trip._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{trip.name}</h3>
                <p className="text-gray-600">{trip.location}</p>
                <p className="text-gray-700 mt-2">
                  Available Slots: {trip.availableSlots}/{trip.totalSlots}
                </p>
                <p className="text-gray-700">Price: ₹{trip.price}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(trip)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTrip(trip._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizerDashboard;