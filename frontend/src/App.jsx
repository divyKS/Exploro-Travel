import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import TripDetails from './components/TripDetails';
import UserDashboard from './components/UserDashboard';
import OrganizerDashboard from './components/OrganizerDashboard';
import PrivateRoute from './components/PrivateRoute';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/trips/:id" element={<TripDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <UserDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/organizer/dashboard"
                element={
                  <PrivateRoute>
                    <OrganizerDashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;