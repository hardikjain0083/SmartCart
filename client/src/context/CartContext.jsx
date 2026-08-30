import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartId, setCartId] = useState(localStorage.getItem('cartId'));

  useEffect(() => {
    if (cartId) {
      axios.get(`/api/cart/${cartId}`)
        .then(res => setCart(res.data))
        .catch(err => {
          console.error('Error fetching cart:', err);
          localStorage.removeItem('cartId');
          setCartId(null);
        });
    }
  }, [cartId]);

  const initCart = async () => {
    if (!cartId) {
      const res = await axios.post('/api/cart');
      setCartId(res.data._id);
      setCart(res.data);
      localStorage.setItem('cartId', res.data._id);
      return res.data._id;
    }
    return cartId;
  };

  const addToCart = async (barcode) => {
    const currentCartId = await initCart();
    const res = await axios.post(`/api/cart/${currentCartId}/add`, { barcode });
    setCart(res.data);
  };

  const updateQty = async (itemId, qty) => {
    if (!cartId) return;
    const res = await axios.put(`/api/cart/${cartId}/item/${itemId}`, { qty });
    setCart(res.data);
  };

  const clearCart = () => {
    localStorage.removeItem('cartId');
    setCartId(null);
    setCart(null);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
