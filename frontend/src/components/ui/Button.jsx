import React from 'react';

const Button = ({ text, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyles =
    'px-6 py-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  
  const variants = {
    primary: 'bg-foodie-primary text-white hover:bg-[#E55A2B]', // Orange
    secondary: 'bg-foodie-text text-white hover:bg-[#39494F]', // Dark Charcoal/Navy
    outline: 'border-2 border-foodie-primary text-foodie-primary hover:bg-foodie-primary hover:text-white',
    danger: 'bg-foodie-danger text-white hover:bg-[#D32F3D]', // Red
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;