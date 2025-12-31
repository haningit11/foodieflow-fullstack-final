import React from 'react';
import { HeartIcon as HeartSolid, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline, EyeIcon } from '@heroicons/react/24/outline';
import Card from './ui/Card';

const MenuItemCard = ({ item, onAddToCart, onToggleFavorite, onViewDetails, isFavorite }) => {
  const getImageSrc = () => {
    if (item?.image && item.image.startsWith('http')) return item.image;
    return 'https://placehold.co/600x400?text=Image';
  };

  return (
    <Card className="p-0 overflow-hidden h-full flex flex-col group border-0 shadow-lg hover:shadow-xl transition-all duration-300" hover={true}>
      <div className="relative overflow-hidden h-64">
        <img
          src={getImageSrc()}
          alt={item.name || 'Menu item'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/600x400?text=Image';
            e.currentTarget.onerror = null;
          }}
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className={`absolute top-4 right-4 p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-110 focus:outline-none ${
            isFavorite
              ? 'bg-foodie-danger text-white'
              : 'bg-white/90 text-gray-400 hover:text-foodie-danger'
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <HeartSolid className="w-6 h-6" />
          ) : (
            <HeartOutline className="w-6 h-6" />
          )}
        </button>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1" title={item.name}>
            {item.name || 'Unnamed Item'}
          </h3>

         <span className="text-xl font-black text-foodie-primary shrink-0 ml-2">
           ${item.price ? Number(item.price).toFixed(2) : '0.00'}
        </span>
        </div>
        
        <div className="flex gap-3 mt-auto">
          {/* View Details Button */}
          <button
            onClick={() => onViewDetails(item)}
            className="flex-1 py-2.5 px-4 rounded-lg border-2 border-gray-200 text-gray-600 font-semibold hover:border-foodie-primary hover:text-foodie-primary transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <EyeIcon className="w-5 h-5" />
            <span>Details</span>
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart(item)}
            className="flex-1 py-2.5 px-4 rounded-lg bg-foodie-primary text-white font-semibold hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            <span>Order</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default MenuItemCard;
