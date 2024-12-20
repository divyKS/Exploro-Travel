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
    <div className="min-h-screen">
    {/* Hero Section */}
    <div className="relative h-[80vh] bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHZhY2F0aW9uJTIwZnVsbCUyMGhkfGVufDB8fDB8fHww)" }}>
      <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
      <div className="relative h-full flex flex-col justify-center items-center text-white px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
          Exploro - Discover Your Next Adventure
        </h1>
        <p className="text-lg md:text-xl text-center max-w-2xl mb-8">
          Experience unforgettable journeys with our curated travel experiences. From mountain peaks to coastal retreats, your dream destination awaits.
        </p>
        <button 
          onClick={() => document.getElementById('trips-section').scrollIntoView({ behavior: 'smooth' })}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Explore Trips
        </button>
      </div>
    </div>

    {/* Stats Section */}
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">1000+</div>
            <div className="text-gray-600">Happy Travelers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">50+</div>
            <div className="text-gray-600">Destinations</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">100%</div>
            <div className="text-gray-600">Satisfaction</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </div>
      </div>
    </div>

    {/* Trips Section */}
    <div id="trips-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Available Trips</h2>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No trips available at the moment.
            </div>
          ) : (
            trips.map(trip => (
              <TripCard key={trip._id} trip={trip} />
            ))
          )}
        </div>
      )}
    </div>

    {/* Features Section */}
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-blue-500 text-4xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold mb-2">Curated Experiences</h3>
            <p className="text-gray-600">Carefully selected destinations and itineraries for unforgettable adventures</p>
          </div>
          <div className="text-center p-6">
            <div className="text-blue-500 text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Best Value</h3>
            <p className="text-gray-600">Competitive prices without compromising on quality and comfort</p>
          </div>
          <div className="text-center p-6">
            <div className="text-blue-500 text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
            <p className="text-gray-600">Professional and knowledgeable guides for every journey</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default Home;