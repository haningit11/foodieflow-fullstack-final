import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import MenuList from '../components/MenuList';
import { useAuth } from '../context/AuthContext';
import { FaHeart } from 'react-icons/fa';

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const handleReloadFavorites = (e) => {
      const ids = Array.isArray(e.detail) ? e.detail : [];
      setFavorites(ids);
    };
    window.addEventListener('reloadFavorites', handleReloadFavorites);
    return () => window.removeEventListener('reloadFavorites', handleReloadFavorites);
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.id) return;
      try {
        const { data } = await axios.get(`${API_URL}/favorites/${user.id}`);
        setFavorites((data || []).map((f) => f.menu_id));
      } catch (e) {
        console.error('Favorites load error:', e);
      }
    };
    loadFavorites();
  }, [user]);

  // Favorites are handled inside MenuList via toggleFavorite

  if (!user) {
    return (
        <div className="min-h-screen py-32 bg-foodie-background flex items-center justify-center px-4">
            <Card className="text-center max-w-md w-full shadow-xl">
                <div className="w-16 h-16 bg-foodie-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaHeart className="text-3xl text-foodie-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foodie-text mb-3">Please Login</h2>
                <p className="text-gray-600 mb-8">
                    You need to be logged in to view your favorite dishes.
                </p>
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
             <h1 className="text-4xl font-extrabold text-foodie-text tracking-tight">My Favorites</h1>
             <p className="mt-4 text-lg text-gray-600">Your personal collection of must-have dishes.</p>
        </div>

        {favorites.length === 0 ? (
          <Card className="text-center py-16 bg-white shadow-lg">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHeart className="text-4xl text-gray-300" />
            </div>
            <p className="text-foodie-text text-xl font-semibold mb-2">
              You haven't added any favorites yet.
            </p>
            <p className="text-gray-500 mb-8">
              Start exploring our menu and add dishes you love!
            </p>
            <Link to="/menu">
                <Button text="Explore Menu" variant="primary" />
            </Link>
          </Card>
        ) : (
          <MenuList ids={favorites} showFilters={false} />
        )}
      </div>
    </div>
  );
};

export default Favorites;
