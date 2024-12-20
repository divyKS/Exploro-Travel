import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TripDetails = () => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axios.get(`http://localhost:3500/api/trips/${id}`);
        setTrip(response.data);
      } catch (error) {
        setError('Error fetching trip details');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      await axios.post('http://localhost:3500/api/cart/add', { tripId: id });
      navigate('/cart'); // Navigate to cart page
    } catch (error) {
      setError(error.response?.data?.error || 'Error adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  // const handleBooking = async () => {
  //   if (!user) {
  //     navigate('/login');
  //     return;
  //   }

  //   try {
  //     await axios.post('http://localhost:3500/api/bookings', { tripId: id });
  //     navigate('/dashboard');
  //   } catch (error) {
  //     setError(error.response?.data?.error || 'Error booking trip');
  //   }
  // };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!trip) return <div>Trip not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <img
            src={trip.images?.large?.url || '/placeholder-image.jpg'}
            alt={trip.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{trip.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Trip Details</h2>
              <p className="text-gray-700 mb-4">{trip.description}</p>
              <div className="space-y-2">
                <p><strong>Location:</strong> {trip.location}</p>
                <p><strong>Start Date:</strong> {new Date(trip.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(trip.endDate).toLocaleDateString()}</p>
                <p><strong>Available Slots:</strong> {trip.availableSlots}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-2xl font-bold mb-4">${trip.price}</div>
              <button
                onClick={handleAddToCart}
                disabled={trip.availableSlots === 0 || addingToCart || user?.role === 'organizer'}
                className={`w-full py-3 px-4 rounded-lg text-white text-center ${
                  trip.availableSlots > 0 && !addingToCart && user?.role !== 'organizer'
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {addingToCart 
                  ? 'Adding to Cart...' 
                  : user?.role === 'organizer'
                    ? 'Organizers Cannot Book'
                    : 'Add to Cart'
                }
              </button>
              {/* <button
                onClick={handleBooking}
                disabled={trip.availableSlots === 0}
                className={`w-full py-3 px-4 rounded-lg text-white text-center ${
                  trip.availableSlots > 0
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {trip.availableSlots > 0 ? 'Book Now' : 'Sold Out'}
              </button> */}
              
              <div className="mt-4 text-sm text-gray-600">
                <h3 className="font-semibold mb-2">Cancellation Policy</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Full refund if cancelled 15 days before the trip</li>
                  <li>50% refund if cancelled 7-14 days before the trip</li>
                  <li>No refund if cancelled less than 7 days before the trip</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;