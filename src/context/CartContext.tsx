// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import HomeService from '../services/HomeService';

type CartContextType = {
  cartCount: number;
  getCount: () => void;
};

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  getCount: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const getCount = async () => {
    try {
      const payload = {
        uid: "b763e4c7-a3fe-4d34-a8b6-4596b12db614",
      };
      const result = await HomeService.getCartCount(payload);
      const count = result.filter((item: { quantity: number }) => item.quantity > 0).length;
      setCartCount(count);
      return count
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  useEffect(() => {
    getCount(); // initial load
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, getCount }}>
      {children}
    </CartContext.Provider>
  );
};
