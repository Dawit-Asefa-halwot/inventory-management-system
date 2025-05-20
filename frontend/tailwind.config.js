/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        background: 'var(--background)',
        'background-secondary': 'var(--background-secondary)',
      },
      textColor: {
        text: 'var(--text)',
        'text-secondary': 'var(--text-secondary)',
      },
    },
  },
  plugins: [],
};