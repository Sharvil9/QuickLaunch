/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: '20px',
        xl: '24px',
        '2xl': '28px',
        '3xl': '34px',
      },
    },
  },
  plugins: [],
};
