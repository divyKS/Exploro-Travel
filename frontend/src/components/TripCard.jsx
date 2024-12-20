import React from 'react';
import { Link } from 'react-router';

const TripCard = ({ trip }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={trip.images?.small?.url || '/placeholder-image.jpg'}
        alt={trip.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{trip.name}</h3>
        <p className="text-gray-600 mb-2">{trip.location}</p>
        <p className="text-gray-800 mb-4">{trip.description.substring(0, 100)}...</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">₹{trip.price}</span>
          <Link
            to={`/trips/${trip._id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Details
          </Link>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {trip.availableSlots} slots available
        </div>
      </div>
    </div>
  );
};

export default TripCard;