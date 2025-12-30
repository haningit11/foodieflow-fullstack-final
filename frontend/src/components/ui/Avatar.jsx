import React from 'react';

const Avatar = ({ src, name, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
  };

  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-foodie-secondary flex items-center justify-center text-white font-semibold overflow-hidden shadow-sm border-2 border-white ring-1 ring-gray-100`}
    >
      {src ? (
        <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
};

export default Avatar;
