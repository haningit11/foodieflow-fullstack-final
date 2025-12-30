import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6 ${hover ? 'hover:-translate-y-1' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;

