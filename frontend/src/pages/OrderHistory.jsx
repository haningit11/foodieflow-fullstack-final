import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(`${API_URL}/orders/${user.id}`);
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Order history load error:', e);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [user]);
  
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`${API_URL}/orders/${user.id}`);
        setOrders(Array.isArray(data) ? data : []);
      } catch {}
    }, 10000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen py-32 bg-foodie-background flex items-center justify-center px-4">
        <Card className="text-center max-w-md w-full shadow-xl">
          <div className="w-16 h-16 bg-foodie-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaClipboardList className="text-3xl text-foodie-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foodie-text mb-3">Please Login</h2>
          <p className="text-gray-600 mb-8">You need to be logged in to view your order history.</p>
          <Link to="/login">
            <Button text="Login Now" variant="primary" className="w-full" />
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 bg-foodie-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foodie-text tracking-tight">Order History</h1>
          <p className="mt-4 text-lg text-gray-600">Review your past orders and their status.</p>
        </div>

        {loading ? (
          <Card className="text-center py-16 bg-white shadow-lg">
            <p className="text-gray-500 text-xl font-semibold">Loading your orders...</p>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="text-center py-16 bg-white shadow-lg">
            <p className="text-gray-500 text-xl font-semibold">No orders found.</p>
            <Link to="/menu">
              <Button text="Browse Menu" variant="primary" className="mt-6" />
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders.map((order) => {
              const isOpen = !!expanded[order.id];
              const statusClass =
                order.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : order.status === 'confirmed'
                  ? 'bg-blue-100 text-blue-700'
                  : order.status === 'delivered'
                  ? 'bg-green-100 text-green-700'
                  : order.status === 'cancelled'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700';
              return (
                <Card key={order.id} className="p-6 bg-white shadow-md hover:shadow-lg transition-all border border-gray-100 rounded-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Order #{order.id}</div>
                      <div className="mt-1 text-sm text-gray-500">
                        {order.order_date ? new Date(order.order_date).toLocaleString() : ''}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusClass}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Payment: <span className="font-semibold capitalize">{order.payment_method || 'none'}</span>
                    </div>
                    <div className="text-right font-bold">
                      Total: €{Number(order.total_price || 0).toFixed(2)}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      className="text-sm font-semibold text-foodie-primary hover:underline"
                      onClick={() =>
                        setExpanded((prev) => ({ ...prev, [order.id]: !prev[order.id] }))
                      }
                    >
                      {isOpen ? 'Hide items' : 'View items'}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="mt-4 space-y-2">
                      {Array.isArray(order.items) && order.items.length > 0 ? (
                        order.items.map((it) => (
                          <div
                            key={`${order.id}-${it.id}`}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                          >
                            <div className="truncate font-semibold text-foodie-text">
                              {it.menu_name || `Item #${it.menu_id}`}
                            </div>
                            <div className="text-sm text-gray-600">x{it.quantity}</div>
                            <div className="text-sm text-gray-600">
                              €{Number(it.price || 0).toFixed(2)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-sm">No items</div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
