// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import HomeService from '../services/HomeService';
import { useAuth } from './AuthContext';

type CartContextType = {
  cartCount: number;
  getCount: () => void;
  clearCartCount: () => void;
};

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  getCount: () => {},
  clearCartCount: () => {}, // NEW
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);
  const { uid } = useAuth();

  const getCount = async () => {
    if (!uid) return; // Avoid API call with null uid
    try {
      const payload = { uid };
      const result = await HomeService.getCartCount(payload);
      const count = result.filter((item: { quantity: number }) => item.quantity > 0).length;
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const clearCartCount = () => {
    setCartCount(0);
  };

  useEffect(() => {
    if (uid) {
      getCount();
    } else {
      setCartCount(0); // Reset on logout
    }
  }, [uid]);
  

  return (
    <CartContext.Provider value={{ cartCount, getCount, clearCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
