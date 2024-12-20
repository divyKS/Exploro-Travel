import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CancellationModal from './CancellationModal';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3500/api/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      setError('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setCancelLoading(true);
    try {
      // simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await axios.post(`http://localhost:3500/api/bookings/${bookingId}/cancel`);
      setIsModalOpen(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      setError('Error cancelling booking');
    } finally {
      setCancelLoading(false);
    }
  };

  const openCancellationModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      
      <div className="space-y-4">
        {bookings.length == 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{booking.trip.name}</h3>
                  <p className="text-gray-600">
                    {new Date(booking.trip.startDate).toLocaleDateString()} - 
                    {new Date(booking.trip.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mt-2">
                    Status: <span className="font-semibold">{booking.status}</span>
                  </p>
                  <p className="text-gray-700">
                    Payment: <span className="font-semibold">${booking.paymentAmount}</span>
                  </p>
                </div>
                
                {booking.status === 'confirmed' && (
                  // <button
                  //   onClick={() => handleCancelBooking(booking._id)}
                  //   className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  // >
                  //   Cancel Booking
                  // </button>
                  
                  <button
                    onClick={() => openCancellationModal(booking)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <CancellationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onConfirmCancel={handleCancelBooking}
        cancelLoading={cancelLoading}
      />
    </div>
  );
};

export default UserDashboard;