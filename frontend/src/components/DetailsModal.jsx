import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from './ui/Button';
import { useAuth } from '../context/AuthContext';

const DetailsModal = ({ item, onClose, onAddToCart }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    onAddToCart(item);
    toast.success('Added to cart');
  };

  useEffect(() => {
    const loadReviews = async () => {
      if (!item?.id) return;
      try {
        const { data } = await axios.get(`${API_URL}/reviews/${item.id}`);
        setReviews(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Reviews load error', e);
      }
    };
    loadReviews();
  }, [item]);

  const submitReview = async () => {
    if (!user?.id) {
      toast.error('Please login to add a review');
      return;
    }
    try {
      const { data: orders } = await axios.get(`${API_URL}/orders/${user.id}`);
      const hasOrdered = (orders || []).some((o) =>
        Array.isArray(o.items) && o.items.some((it) => it.menu_id === item.id)
      );
      if (!hasOrdered) {
        toast.error('You can only review items you have ordered.');
        return;
      }
      await axios.post(`${API_URL}/reviews`, {
        user_id: user.id,
        menu_id: item.id,
        rating,
        comment,
      });
      setComment('');
      const { data } = await axios.get(`${API_URL}/reviews/${item.id}`);
      setReviews(Array.isArray(data) ? data : []);
      toast.success('Review added');
    } catch (e) {
      console.error('Submit review error', e);
    }
  };

  if (!item) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="backdrop-blur-sm bg-black/60 fixed inset-0 z-40 transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-0 max-w-lg w-full max-h-[90vh] overflow-y-auto relative flex flex-col">
          
          {/* Close Button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-md rounded-full p-2 shadow-sm text-gray-500 hover:text-foodie-danger hover:bg-white transition-all duration-200"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Image */}
          <div className="relative w-full h-72 shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="p-8 flex flex-col gap-4">
            {/* Header */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <h2 id="modal-title" className="text-3xl font-bold text-gray-900">
                  {item.name}
                </h2>
                <span className="text-2xl font-black text-foodie-primary">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <span className="inline-block px-3 py-1 bg-foodie-secondary/10 text-foodie-secondary rounded-full text-sm font-semibold tracking-wide uppercase">
                {item.category}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed">
              {item.description || "A delicious choice from our menu, prepared with fresh ingredients and passion."}
            </p>

            {/* Actions */}
            <div className="pt-4 mt-auto">
              <Button 
                text="Add to Cart" 
                onClick={handleAddToCart}
                variant="primary"
                className="w-full py-4 text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              />
            </div>

            <div className="mt-6 border-t pt-6">
              <h3 className="text-xl font-bold mb-3">Reviews</h3>
              <div className="space-y-3 mb-4">
                {reviews.length === 0 ? (
                  <div className="text-gray-500">No reviews yet.</div>
                ) : (
                  reviews.map((r) => (
                    <div key={`${r.user_id}-${r.created_at}`} className="border rounded-lg p-3">
                      <div className="font-semibold">Rating: {r.rating}/5</div>
                      <div className="text-gray-600">{r.comment}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border rounded-lg px-3 py-2"
                >
                  {[1,2,3,4,5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a review..."
                  className="flex-1 border rounded-lg px-3 py-2"
                />
                <Button text="Submit" onClick={submitReview} variant="outline" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsModal;
