/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#140021',
          'bg-secondary': '#1B012B',
          'bg-card': '#2A0845',
        },
        purple: {
          primary: '#8A00FF',
          secondary: '#5B4DFF',
          accent: '#B15CFF',
          glow: '#A855F7',
        },
        green: {
          positive: '#00F5A0',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, #2563eb 0%, #7e22ce 100%)',
        'gradient-purple': 'linear-gradient(135deg, #8A00FF 0%, #5B4DFF 100%)',
        'gradient-dark': 'linear-gradient(180deg, #140021 0%, #1B012B 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(138, 0, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(138, 0, 255, 0.4)',
      },
    },
  },
  plugins: [],
}
