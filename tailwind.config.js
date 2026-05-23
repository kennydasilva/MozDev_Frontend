/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        alert: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        surface: {
          50: '#f8f7fa',
          100: '#f1f0f4',
          200: '#e8e6ed',
          300: '#d4d1db',
          400: '#a09caa',
          500: '#7c7885',
          600: '#5c5865',
          700: '#3d3a45',
          800: '#2a2732',
          900: '#1a1723',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        mobile: '430px',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'soft-md': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}

