import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaShoppingBag } from 'react-icons/fa';

const Order = () => {
  const { cart, setCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const updateQuantity = (itemId, change) => {
    setCart((prevCart) => {
      const next = prevCart
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) return null;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean);
      return next;
    });
    const guestToken = localStorage.getItem('foodieflow_guest_token');
    const current = cart.find((i) => i.id === itemId);
    const nextQty = (current?.quantity || 0) + change;
    if (user?.id) {
      const url = `http://localhost:5000/cart/${user.id}/item/${itemId}`;
      if (nextQty <= 0) {
        axios.delete(url).catch(() => {});
      } else {
        axios.put(url, { quantity: nextQty }).catch(() => {});
      }
    } else if (guestToken) {
      const url = `http://localhost:5000/cart/guest/${guestToken}/item/${itemId}`;
      if (nextQty <= 0) {
        axios.delete(url).catch(() => {});
      } else {
        axios.put(url, { quantity: nextQty }).catch(() => {});
      }
    }
  };

  const placeOrder = async () => {
    if (!user) {
        toast.error('Please login to place an order');
        navigate('/login', { state: { from: { pathname: '/order' } } });
        return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    if (!phone || phone.trim().length < 7) {
      toast.error('Enter a valid phone number');
      return;
    }
    if (!paymentMethod) {
      toast.error('Select a payment method');
      return;
    }
    try {
      const { data } = await axios.post('http://localhost:5000/orders', {
        user_id: user.id,
        status: 'pending',
        payment_method: paymentMethod,
      });
      const orderId = data?.id;
      if (!orderId) {
        toast.error('Order creation failed');
        return;
      }
      for (const item of cart) {
        await axios.post('http://localhost:5000/order_items', {
          order_id: orderId,
          menu_id: item.id,
          quantity: item.quantity,
          price: item.price ?? 0,
        });
      }
      await axios.delete(`http://localhost:5000/cart/${user.id}`);
      setCart([]);
      toast.success('Order placed successfully');
      navigate('/orders');
    } catch {
      toast.error('Failed to place order');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen py-16 bg-foodie-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-foodie-text tracking-tight">Your Order</h1>
            <p className="mt-4 text-lg text-gray-600">Review your cart and checkout.</p>
        </div>

        {cart.length === 0 ? (
          <Card className="text-center py-16 bg-white shadow-lg">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingBag className="text-4xl text-gray-300" />
            </div>
            <p className="text-foodie-text text-xl font-semibold mb-2">Your cart is empty.</p>
            <p className="text-gray-500 mb-8">Add some delicious items from our menu!</p>
            <Link to="/menu">
                <Button text="Browse Menu" variant="primary" />
            </Link>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="p-4 flex flex-col sm:flex-row gap-6 shadow-md hover:shadow-lg transition-shadow">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-xl"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-foodie-text">{item.name}</h3>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                aria-label="Remove item"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-md bg-white text-gray-600 hover:text-foodie-primary hover:shadow-sm flex items-center justify-center transition-all font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold w-8 text-center text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-md bg-white text-gray-600 hover:text-foodie-primary hover:shadow-sm flex items-center justify-center transition-all font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xl font-black text-foodie-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border border-gray-100 sticky top-24">
                <h2 className="text-2xl font-bold text-foodie-text mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} <span className="text-gray-400">x{item.quantity}</span>
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 mb-6">
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <input
                      type="text"
                      value={user?.username || ''}
                      readOnly
                      className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 0701234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">Select</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="mobile">Mobile Money</option>
                    </select>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-6 mt-2">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-foodie-text">Total</span>
                    <span className="text-3xl font-black text-foodie-primary">${total.toFixed(2)}</span>
                  </div>
                  <Button
                    text={user ? "Checkout" : "Login to Checkout"}
                    onClick={placeOrder}
                    variant="primary"
                    className="w-full shadow-lg hover:shadow-xl py-4 text-lg"
                  />
                  {!user && (
                      <p className="text-xs text-center text-gray-500 mt-2">You will be redirected to login page.</p>
                  )}
                  {user && (
                    <Link to="/orders" className="block mt-4">
                      <Button
                        text="View Order History"
                        variant="outline"
                        className="w-full"
                      />
                    </Link>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
