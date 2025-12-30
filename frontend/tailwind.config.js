/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        foodie: {
          // Core Palette
          'primary': '#FF6B35', // Orange
          'secondary': '#4CAF50', // Green
          'background': '#F9F7F3', // Creamy Off-White
          'text': '#263238', // Dark Charcoal/Navy
          'danger': '#E63946', // Red
          
          // Legacy names kept for compatibility (using new hex values for green/charcoal)
          'orange': '#FF6B35',
          'green': '#4CAF50',
          'red': '#E63946',
          'cream': '#F9F7F3',
          'charcoal': '#263238',
        },
      },
    },
  },
  plugins: [],
}