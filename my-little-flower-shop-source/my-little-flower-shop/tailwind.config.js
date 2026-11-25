/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF5E9',
        'dusty-pink': '#E9B8BE',
        'sage-green': '#A8B59B',
        burgundy: '#813C4A',
        'soft-yellow': '#F5DFA8',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        cozy: '0 10px 30px -10px rgba(129, 60, 74, 0.14)',
        paper: '0 4px 18px rgba(129, 60, 74, 0.08)',
      },
    },
  },
  plugins: [],
};
