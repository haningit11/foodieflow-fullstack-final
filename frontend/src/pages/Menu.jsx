import React from 'react';
import MenuList from '../components/MenuList';

const Menu = () => {

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold text-foodie-primary tracking-widest uppercase mb-2">Discover Flavor</h2>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Explore Our Menu
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Fresh, fast, and delivered right to your table. Find your next favorite meal.
          </p>
        </div>
        <MenuList />
      </div>
    </div>
  );
};

export default Menu;
