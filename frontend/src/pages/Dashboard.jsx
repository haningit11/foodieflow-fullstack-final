import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

/**
 * Dashboard Page
 * 
 * A protected area for admin users.
 * Real admin controls: Users, Orders, Products, Reviews, Favorites.
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', category: '', price: '', description: '', image: '' });
  const [reviews, setReviews] = useState([]);
  // favorites removed

  const tabs = [
    { id: 'users', label: 'Users' },
    { id: 'orders', label: 'Orders' },
    { id: 'products', label: 'Products' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/users`);
        setUsers(Array.isArray(data) ? data : []);
      } catch {}
    };
    const loadOrders = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/orders`);
        setOrders(Array.isArray(data) ? data : []);
      } catch {}
    };
    const loadMenu = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/menu`);
        setMenu(Array.isArray(data) ? data : []);
      } catch {}
    };
    const loadReviews = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/reviews`);
        setReviews(Array.isArray(data) ? data : []);
      } catch {}
    };
    loadUsers();
    loadOrders();
    loadMenu();
    loadReviews();
  }, []);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {}
  };

  const updateUserRole = async (id, role) => {
    try {
      await axios.put(`${API_URL}/users/${id}/role`, { role });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch {}
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch {}
  };

  const startEditProduct = (p) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name || '',
      category: p.category || '',
      price: String(p.price ?? ''),
      description: p.description || '',
      image: p.image || '',
    });
  };

  const cancelEditProduct = () => {
    setEditingProductId(null);
    setProductForm({ name: '', category: '', price: '', description: '', image: '' });
  };

  const saveProduct = async () => {
    const payload = {
      name: productForm.name,
      category: productForm.category,
      price: Number(productForm.price),
      description: productForm.description,
      image: productForm.image,
    };
    try {
      if (editingProductId) {
        await axios.put(`${API_URL}/menu/update/${editingProductId}`, payload);
        setMenu((prev) => prev.map((m) => (m.id === editingProductId ? { ...m, ...payload } : m)));
      } else {
        const { data } = await axios.post(`${API_URL}/menu/create`, payload);
        setMenu((prev) => [{ id: data.id, ...payload }, ...prev]);
      }
      cancelEditProduct();
    } catch {}
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/menu/delete/${id}`);
      setMenu((prev) => prev.filter((m) => m.id !== id));
    } catch {}
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(`${API_URL}/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome back, <span className="font-semibold text-foodie-primary">{user?.username}</span>! 
            You are logged in as <span className="font-semibold capitalize">{user?.role}</span>.
          </p>
        </div>

        <div className="mb-6 border-b">
          <div className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-t ${tab === t.id ? 'bg-white border border-b-0' : 'bg-gray-100'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'users' && (
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Username</th>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">Role</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b">
                      <td className="py-2 px-3">{u.id}</td>
                      <td className="py-2 px-3">{u.username}</td>
                      <td className="py-2 px-3">{u.email}</td>
                      <td className="py-2 px-3">
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <Button text="Delete" variant="outline" className="text-red-600 border-red-200" onClick={() => deleteUser(u.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === 'orders' && (
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 px-3">Order #</th>
                    <th className="py-2 px-3">User</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Total</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Items</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b align-top">
                      <td className="py-2 px-3">{o.id}</td>
                      <td className="py-2 px-3">{o.user_id}</td>
                      <td className="py-2 px-3">{o.order_date ? new Date(o.order_date).toLocaleString() : ''}</td>
                      <td className="py-2 px-3">€{Number(o.total_price || 0).toFixed(2)}</td>
                      <td className="py-2 px-3">
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="delivered">delivered</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <div className="space-y-1">
                          {(o.items || []).map((it) => (
                            <div key={`${o.id}-${it.id}`} className="flex gap-2 text-xs">
                              <span>Menu #{it.menu_id}</span>
                              <span>x{it.quantity}</span>
                              <span>€{Number(it.price || 0).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === 'products' && (
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold mb-2">{editingProductId ? 'Edit Product' : 'Add Product'}</h3>
                <div className="space-y-2">
                  <input className="border rounded px-3 py-2 w-full" placeholder="Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                  <input className="border rounded px-3 py-2 w-full" placeholder="Category" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
                  <input className="border rounded px-3 py-2 w-full" placeholder="Price" type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
                  <input className="border rounded px-3 py-2 w-full" placeholder="Image URL (http/https)" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} />
                  <textarea className="border rounded px-3 py-2 w-full" placeholder="Description" rows={3} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
                  <div className="flex gap-2">
                    <Button text={editingProductId ? 'Save Changes' : 'Add Product'} variant="primary" onClick={saveProduct} />
                    {editingProductId && <Button text="Cancel" variant="outline" onClick={cancelEditProduct} />}
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Price</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menu.map((m) => (
                    <tr key={m.id} className="border-b">
                      <td className="py-2 px-3">{m.id}</td>
                      <td className="py-2 px-3">{m.name}</td>
                      <td className="py-2 px-3">{m.category}</td>
                      <td className="py-2 px-3">€{Number(m.price || 0).toFixed(2)}</td>
                      <td className="py-2 px-3">
                        <div className="flex gap-2">
                          <Button text="Edit" variant="outline" onClick={() => startEditProduct(m)} />
                          <Button text="Delete" variant="outline" className="text-red-600 border-red-200" onClick={() => deleteProduct(m.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === 'reviews' && (
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">User</th>
                    <th className="py-2 px-3">Menu</th>
                    <th className="py-2 px-3">Rating</th>
                    <th className="py-2 px-3">Comment</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => (
                    <tr key={r.id} className="border-b">
                      <td className="py-2 px-3">{r.id}</td>
                      <td className="py-2 px-3">{r.username || r.user_id}</td>
                      <td className="py-2 px-3">{r.menu_name || r.menu_id}</td>
                      <td className="py-2 px-3">{r.rating}</td>
                      <td className="py-2 px-3">{r.comment}</td>
                      <td className="py-2 px-3">
                        <Button text="Delete" variant="outline" className="text-red-600 border-red-200" onClick={() => deleteReview(r.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
