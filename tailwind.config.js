/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        terracotta: '#C65D3B',
        sage: '#7A9E7E',
        savor: '#2B2118',
      },
      borderRadius: {
        card: '1rem',
      },
    },
  },
  plugins: [],
};
