/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#6366f1', // Premium Indigo
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#0f172a',
        },
        darkbg: {
          50: '#1e293b',
          100: '#0f172a',
          200: '#020617', // Sleek deep dashboard charcoal/black
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'Satoshi', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(99, 102, 241, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'premium': '0 10px 40px -10px rgba(0,0,0,0.05)',
        'premium-dark': '0 20px 50px -12px rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
