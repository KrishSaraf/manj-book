/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nature-inspired green palette
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        forest: {
          50: '#f7fef7',
          100: '#ecfdf0',
          200: '#d3f8da',
          300: '#adf0b8',
          400: '#7de390',
          500: '#4fc76b',
          600: '#3ba856',
          700: '#318547',
          800: '#2c6b3d',
          900: '#265834',
        },
        sage: {
          50: '#f8faf8',
          100: '#f0f5f0',
          200: '#dde8de',
          300: '#c4d5c6',
          400: '#a6bfa9',
          500: '#87a48b',
          600: '#6d8471',
          700: '#58695c',
          800: '#48564b',
          900: '#3d473f',
        },
        earth: {
          50: '#faf9f7',
          100: '#f3f1ed',
          200: '#e6e0d7',
          300: '#d4cab8',
          400: '#c0b094',
          500: '#a89577',
          600: '#96816a',
          700: '#7d6c59',
          800: '#67594d',
          900: '#554a42',
        }
      },
      fontFamily: {
        'serif': ['Crimson Text', 'serif'],
        'sans': ['Inter', 'sans-serif'],
        'display': ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'nature-gradient': 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
        'forest-gradient': 'linear-gradient(135deg, #4fc76b 0%, #3ba856 50%, #318547 100%)',
        'sage-gradient': 'linear-gradient(135deg, #87a48b 0%, #6d8471 50%, #58695c 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 