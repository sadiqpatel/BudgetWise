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
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
        },
        success: {
          DEFAULT: '#22C55E',
          dark: '#16A34A',
        },
        warning: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          dark: '#DC2626',
        },
        background: {
          DEFAULT: '#F8FAFC',
          dark: '#0F172A',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1E293B',
        }
      }
    },
  },
  plugins: [],
}
