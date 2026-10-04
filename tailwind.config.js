/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        cream: '#F6F2EA',
        terracotta: '#C56B4A',
        sage: '#2F6B3A',
        savor: '#16301C',
        gold: '#D4A017',
        map: '#E6EEE3',
        mint: '#F2F6F1',
        cocoa: '#5C4A38',
      },
      borderRadius: {
        card: '1rem',
      },
    },
  },
  plugins: [],
};
