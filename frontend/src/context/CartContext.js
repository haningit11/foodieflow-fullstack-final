import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import axios from 'axios';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('foodieflow_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  

  useEffect(() => {
    localStorage.setItem('foodieflow_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cart]);

  useEffect(() => {
    const handleClear = () => {
      setCart([]);
      
      localStorage.removeItem('foodieflow_cart');
    };
    const handleReload = (e) => {
      const next = Array.isArray(e.detail) ? e.detail : [];
      setCart(next);
    };
    window.addEventListener('clearCart', handleClear);
    window.addEventListener('reloadCart', handleReload);
    return () => {
      window.removeEventListener('clearCart', handleClear);
      window.removeEventListener('reloadCart', handleReload);
    };
  }, []);

  useEffect(() => {
    const sync = async () => {
      if (user?.id) {
        try {
          const { data } = await axios.get(`http://localhost:5000/cart/${user.id}`);
          const rows = Array.isArray(data) ? data : [];
          const next = rows.map((r) => ({
            id: r.menu_id,
            name: r.menu_name || `Item ${r.menu_id}`,
            price: r.menu_price ?? 0,
            image: '',
            quantity: r.quantity || 1,
          }));
          setCart(next);
        } catch {
          setCart([]);
        }
      }
    };
    sync();
  }, [user]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart!`);
    if (user?.id) {
      axios
        .post(`http://localhost:5000/cart/${user.id}`, { menu_id: item.id, quantity: 1 })
        .catch(() => {});
    }
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const updated = prevCart.filter((cartItem) => cartItem.id !== itemId);
      toast.success('Item removed from cart');
      return updated;
    });
    if (user?.id) {
      axios.delete(`http://localhost:5000/cart/${user.id}/item/${itemId}`).catch(() => {});
    }
  };

  const cartTotalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    cartTotalQuantity,
    setCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
