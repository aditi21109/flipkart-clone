/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        flipblue:   '#2874f0',
        fliporange: '#fb641b',
        flipyellow: '#ff9f00',
        flipgreen:  '#388e3c',
        flipgray:   '#878787',
        flipbg:     '#f1f3f6',
      },
    },
  },
  plugins: [],
};
