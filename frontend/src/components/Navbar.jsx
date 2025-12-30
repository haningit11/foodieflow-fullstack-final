import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCartIcon, UserIcon, ArrowRightEndOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; 

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
        const savedCart = localStorage.getItem('foodieflow_cart');
        if (savedCart) {
          const cart = JSON.parse(savedCart);
          const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(totalItems);
        } else {
          setCartCount(0);
        }
      };
      updateCartCount();
      window.addEventListener('storage', updateCartCount);
      window.addEventListener('cartUpdated', updateCartCount);
      return () => {
        window.removeEventListener('storage', updateCartCount);
        window.removeEventListener('cartUpdated', updateCartCount);
      };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Favorites', path: '/favorites' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Close menu on action
    navigate('/');
  }

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu on action
  }

  return (
    <nav className="sticky top-0 z-50 shadow-md bg-white/95 backdrop-blur-sm border-b border-gray-100">
      {/* Desktop/Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
        
          {/* 1. Logo (Left) */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="text-3xl font-extrabold text-foodie-primary tracking-tight group-hover:text-orange-600 transition duration-300">
              Foodie<span className="text-foodie-text">Flow</span>
            </span>
          </Link>

          {/* 2. Desktop Navigation Links (Center) - Hidden on mobile */}
          <div className="hidden md:flex flex-1 justify-center">
              <ul className="flex gap-8 items-center text-base font-medium">
              {navLinks.map((link) => (
                  <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                      `relative px-1 py-2 text-sm font-semibold transition-colors duration-300
                       ${isActive 
                         ? 'text-foodie-primary' 
                         : 'text-gray-600 hover:text-foodie-primary'
                       }
                       after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-foodie-primary after:transition-all after:duration-300
                       ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
                      `
                  }
                  >
                  {link.name}
                  </NavLink>
              ))}
              {/* Admin Dashboard Link */}
              {user && user.role === 'admin' && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                      `relative px-1 py-2 text-sm font-semibold transition-colors duration-300
                       ${isActive 
                         ? 'text-foodie-primary' 
                         : 'text-gray-600 hover:text-foodie-primary'
                       }
                       after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-foodie-primary after:transition-all after:duration-300
                       ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
                      `
                  }
                >
                  Dashboard
                </NavLink>
              )}
              </ul>
          </div>

          {/* 3. Desktop Icons (Right) - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            
            {/* Cart Icon */}
            <Link to="/order" className="relative p-2.5 rounded-full text-gray-600 hover:bg-foodie-background hover:text-foodie-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-foodie-primary/50">
              <ShoppingCartIcon className="w-6 h-6" aria-label="View Cart" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-foodie-danger text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white shadow-sm">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth Icon */}
            <div className="ml-2">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    Hi, {user.username}
                  </span>
                  <button 
                    onClick={handleLogout} 
                    aria-label="Logout" 
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-foodie-danger/10 text-gray-700 hover:text-foodie-danger transition-all duration-300 font-medium text-sm"
                  >
                    <span>Logout</span>
                    <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleNavigate('/login')} 
                  aria-label="Login"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-foodie-primary hover:bg-orange-600 text-white transition-all duration-300 shadow-md hover:shadow-lg font-semibold text-sm transform hover:-translate-y-0.5"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>

          {/* 4. Mobile Menu & Cart Button (Visible on small screens) */}
          <div className="md:hidden flex items-center gap-2">
              {/* Cart Icon (Mobile View) */}
              <Link to="/order" className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition focus:outline-none">
                  <ShoppingCartIcon className="w-6 h-6" aria-label="View Cart" />
                  {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-foodie-danger text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white">
                      {cartCount > 99 ? '99+' : cartCount}
                  </span>
                  )}
              </Link>

              {/* Hamburger/Close Button */}
              <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none transition"
                  aria-expanded={isMenuOpen}
                  aria-label="Toggle navigation menu"
              >
                  {isMenuOpen ? (
                      <XMarkIcon className="w-7 h-7" />
                  ) : (
                      <Bars3Icon className="w-7 h-7" />
                  )}
              </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer (Conditionally rendered) */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-white shadow-xl transform transition-all duration-300 ease-in-out z-40 overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col p-4 space-y-2 border-t border-gray-100">
            {/* Navigation Links */}
            {navLinks.map((link) => (
                <NavLink
                    key={`mobile-${link.name}`}
                    to={link.path}
                    // Close menu when navigating
                    onClick={() => handleNavigate(link.path)}
                    className={({ isActive }) =>
                        `py-3 px-4 rounded-xl text-base font-semibold transition duration-200 block 
                         ${isActive 
                            ? 'bg-foodie-primary/10 text-foodie-primary' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                    }
                >
                    {link.name}
                </NavLink>
            ))}

            {/* Mobile Admin Dashboard Link */}
            {user && user.role === 'admin' && (
              <NavLink
                to="/dashboard"
                onClick={() => handleNavigate('/dashboard')}
                className={({ isActive }) =>
                    `py-3 px-4 rounded-xl text-base font-semibold transition duration-200 block 
                     ${isActive 
                        ? 'bg-foodie-primary/10 text-foodie-primary' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                }
              >
                Dashboard
              </NavLink>
            )}

            <div className="pt-4 mt-2 border-t border-gray-100">
                {/* Auth Action in Mobile Menu */}
                {user ? (
                    <div className="space-y-3">
                      <div className="px-4 py-2 text-sm font-medium text-gray-500">
                        Signed in as <span className="text-foodie-text font-bold">{user.username}</span>
                      </div>
                      <button 
                          onClick={handleLogout} 
                          className="w-full py-3 px-4 rounded-xl text-base font-bold text-white bg-foodie-danger hover:bg-red-700 transition duration-200 block text-center shadow-md"
                      >
                          Logout
                      </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => handleNavigate('/login')} 
                        className="w-full py-3 px-4 rounded-xl text-base font-bold text-white bg-foodie-primary hover:bg-orange-600 transition duration-200 block text-center shadow-md"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
