import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(0);

export const CartProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);

  const updateCartCount = (count) => {
    setCartItemCount(count);
  };

  return (
    <CartContext.Provider value={{ cartItemCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);