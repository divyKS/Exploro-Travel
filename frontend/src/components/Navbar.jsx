import React from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation()
  const { cartItemCount } = useCart();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            Travel Booking
          </Link>
          <div className="flex items-center space-x-4">
            {user && user.role == 'user' && (
              <Link to="/cart" className="hover:text-blue-200 relative">
                Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            {user ? (
              <>
                {
                  location.pathname.includes('dashboard')
                  ? <Link to='/'>Home</Link>
                    : <Link to={user.role === 'organizer' ? '/organizer/dashboard' : '/dashboard'}>Dashboard</Link>
                }
                
                <button
                  onClick={logout}
                  className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;