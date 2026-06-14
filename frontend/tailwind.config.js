/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Support theme switching
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0F19',
          card: '#151D30',
          border: '#1F2A45',
          text: '#F3F4F6',
          muted: '#9CA3AF',
        },
        brand: {
          primary: '#6366F1', // Indigo
          secondary: '#06B6D4', // Cyan
          accent: '#10B981', // Emerald
          danger: '#EF4444', // Red
          warning: '#F59E0B', // Amber
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow': '0 0 15px rgba(99, 102, 241, 0.4)',
      }
    },
  },
  plugins: [],
}
