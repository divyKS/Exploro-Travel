import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:3500/api/cart');
      setCart(response.data);
    } catch (error) {
      setError('Error fetching cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (tripId) => {
    try {
      await axios.delete(`http://localhost:3500/api/cart/items/${tripId}`);
      fetchCart();
    } catch (error) {
      setError('Error removing item');
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => total + item.trip.price, 0);
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div className="text-red-600">{error}</div>;
  
  if (!cart || cart.items.length === 0) {
    return <div className="text-center py-8">Your cart is empty</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {cart.items.map((item) => (
          <div key={item._id} className="flex items-start justify-between py-4 border-b">
            <div>
              <h3 className="text-lg font-semibold">{item.trip.name}</h3>
              <p className="text-gray-600">{item.trip.location}</p>
              <p className="text-gray-700">Price: ${item.trip.price}</p>
            </div>
            <button
              onClick={() => handleRemoveItem(item.trip._id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span>${calculateTotal()}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full mt-4 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;