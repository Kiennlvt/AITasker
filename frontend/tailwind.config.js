/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink:     '#0A0A0F',
        surface: '#13131F',
        card:    '#16162A',
        accent:  { DEFAULT: '#3B5BDB', hover: '#4C6EF5' },
        teal:    { DEFAULT: '#0CA678', light: '#3ECFA0' },
        amber:   '#F59F00',
        danger:  '#E24B4A',
        muted:   { DEFAULT: '#6B6B85', light: '#9494AC' },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
