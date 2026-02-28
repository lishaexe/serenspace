/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        head: ['"Cormorant Garamond"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        lilac: '#e8dff8',
        blush: '#fce0ec',
        sky: '#c8e8f8',
        sage: '#d4f0e4',
        primary: '#2d2538',
        muted: '#8c7fa0',
        accent: '#a78bca',
      },
      borderRadius: {
        xl2: '18px',
      },
    },
  },
  plugins: [],
}
