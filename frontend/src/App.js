import React from 'react';
import { HashRouter  as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // for messages instead of alert()
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Favorites from './pages/Favorites';
import Order from './pages/Order'; 
import OrderHistory from './pages/OrderHistory';
import LoginForm from './components/ui/auth/LoginForm';
import Signup from './components/ui/auth/Signup';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; 
import ProtectedRoute from './context/ProtectedRoute'; 
import './App.css'; 
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import AdminRoute from './components/AdminRoute';


function App() {
  return (
    <AuthProvider>
      <CartProvider> 
        <Router>
          <div className="App min-h-screen">
            <Navbar /> 
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order"
                element={
                  <ProtectedRoute>
                    <Order />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Footer />

            <Toaster
              position="top-center"
              toastOptions={{
                duration: 1500,
                style: {
                  background: '#FAFAFA',
                  color: '#2E2E2E',
                  boxShadow:
                    '0 4px 6px -1px rgba(46, 46, 46, 0.1), 0 2px 4px -1px rgba(46, 46, 46, 0.06)',
                  border: '1px solid rgba(46, 46, 46, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#FF6B35',
                    secondary: '#FAFAFA',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#E63946',
                    secondary: '#FAFAFA',
                  },
                },
              }}
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
    
  );
}

export default App;
