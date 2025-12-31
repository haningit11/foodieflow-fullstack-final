import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import MenuList from '../components/MenuList';
import { StarIcon } from '@heroicons/react/24/solid';
import { FaShippingFast, FaLeaf, FaUserTie } from 'react-icons/fa';

/**
 * Home Page
 * 
 * The landing page of the application.
 * Features a hero section, featured menu items, and calls to action.
 */
const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Lina', rating: 5, comment: 'The sushi was fresh and delicious! Best in town.' },
    { id: 2, name: 'Omar', rating: 4, comment: 'Loved the pizza, will order again. Fast delivery.' },
    { id: 3, name: 'Sara', rating: 5, comment: 'Fast delivery and great service! Highly recommended.' },
  ]);
  const [menuItems, setMenuItems] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', menuId: '' });

  const API_URL = process.env.REACT_APP_API_URL;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/menu`);
        setMenuItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Menu load error:', e);
      }
    };
    loadMenu();
  }, []);

  // Featured dishes now use backend data via MenuList

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to submit a review');
      navigate('/login');
      return;
    }
    if (!reviewForm.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }
    if (!reviewForm.menuId) {
      toast.error('Please select a menu item');
      return;
    }

    try {
      await axios.post(`${API_URL}/reviews`, {
        user_id: user.id,
        menu_id: reviewForm.menuId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      const newReview = {
        id: Date.now(),
        name: user.username || 'Anonymous',
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      };
      setReviews([newReview, ...reviews]);
      setReviewForm({ rating: 5, comment: '', menuId: '' });
      toast.success('Review submitted successfully!');
    } catch (e) {
      console.error('Submit review error', e);
      toast.error('Failed to submit review');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon 
        key={i} 
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`} 
      />
    ));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600)' }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-2xl">
            Experience <span className="text-foodie-primary">Flavor</span> Like Never Before
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Fresh ingredients, expert chefs, and lightning-fast delivery. 
            Your favorite meals, just a click away.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/menu">
              <Button 
                text="Order Now" 
                variant="primary" 
                className="px-10 py-4 text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              />
            </Link>
            <Link to="/about">
              <Button 
                text="Our Story" 
                variant="outline" 
                className="px-10 py-4 text-lg border-white text-white hover:bg-white hover:text-foodie-text hover:border-white shadow-lg backdrop-blur-sm"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-sm font-bold text-foodie-primary tracking-widest uppercase">Our Best Sellers</h2>
          <h3 className="text-4xl md:text-5xl font-black text-foodie-text">Featured Dishes</h3>
          <div className="w-24 h-1.5 bg-foodie-primary mx-auto rounded-full"></div>
        </div>
        
        <MenuList limit={3} showFilters={false} />
        
        <div className="text-center mt-12">
          <Link to="/menu" className="inline-flex items-center gap-2 text-foodie-primary font-bold hover:text-orange-700 transition-colors text-lg group">
            View Full Menu 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section (New) */}
      <section className="bg-gray-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div className="p-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-foodie-primary text-3xl shadow-md">
                        <FaShippingFast />
                    </div>
                    <h3 className="text-xl font-bold text-foodie-text mb-3">Fast Delivery</h3>
                    <p className="text-gray-600">Hot and fresh food delivered to your doorstep within 30 minutes.</p>
                </div>
                <div className="p-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-foodie-primary text-3xl shadow-md">
                        <FaLeaf />
                    </div>
                    <h3 className="text-xl font-bold text-foodie-text mb-3">Fresh Ingredients</h3>
                    <p className="text-gray-600">We use only the freshest, high-quality ingredients for our dishes.</p>
                </div>
                <div className="p-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-foodie-primary text-3xl shadow-md">
                        <FaUserTie />
                    </div>
                    <h3 className="text-xl font-bold text-foodie-text mb-3">Expert Chefs</h3>
                    <p className="text-gray-600">Our culinary experts craft every meal with passion and precision.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Review Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-foodie-primary tracking-widest uppercase">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-black text-foodie-text">What Our Customers Say</h3>
          <div className="w-24 h-1.5 bg-foodie-primary mx-auto rounded-full mt-4"></div>
        </div>
        
        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {reviews.map((review) => (
            <Card key={review.id} className="p-8 border-t-4 border-t-foodie-primary hover:shadow-2xl transition-all duration-300 bg-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-foodie-primary/10 flex items-center justify-center text-foodie-primary font-bold">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">{review.name}</h4>
                </div>
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"{review.comment}"</p>
            </Card>
          ))}
        </div>

        {/* Review Form - Conditionally Rendered */}
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 md:p-12 shadow-2xl bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-foodie-primary"></div>
            
            {user ? (
              <>
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Leave a Review</h3>
                  <p className="text-gray-500">Share your experience with the FoodieFlow community</p>
                </div>
                
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Rating</label>
                    <div className="flex gap-4">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: num })}
                          className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${
                            num <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Menu Item</label>
                    <select
                      value={reviewForm.menuId}
                      onChange={(e) => setReviewForm({ ...reviewForm, menuId: Number(e.target.value) })}
                      className="w-full px-5 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-foodie-primary/50 focus:border-foodie-primary"
                      required
                    >
                      <option value="">Select a menu item</option>
                      {menuItems.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Your Comment</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-foodie-primary/50 focus:border-foodie-primary bg-gray-50 focus:bg-white transition-all resize-none"
                      rows="4"
                      placeholder="Tell us what you liked..."
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      text="Submit Review" 
                      type="submit" 
                      variant="primary" 
                      className="w-full md:w-auto px-8 py-3 text-lg shadow-lg hover:shadow-xl"
                    />
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Enjoyed your meal?</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Log in to share your thoughts and help others discover their next favorite dish.</p>
                <div className="flex justify-center gap-4">
                  <Link to="/login">
                    <Button text="Sign In to Review" variant="primary" className="px-8 py-3" />
                  </Link>
                  <Link to="/signup">
                    <Button text="Create Account" variant="outline" className="px-8 py-3" />
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
