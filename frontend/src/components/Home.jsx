import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TripCard from '../components/TripCard';

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('http://localhost:3500/api/trips');
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Available Trips</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.length == 0 ? (
          <div>No trips available.</div>
        ) : (
          trips.map(trip => (
            <TripCard key={trip._id} trip={trip} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;