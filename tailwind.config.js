/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary blues
        'blue-primary': '#2563EB',
        'blue-light': '#3B82F6',
        'blue-dark': '#1E3A8A',
        // Accent purples
        'purple-primary': '#7C3AED',
        'purple-light': '#8B5CF6',
        'purple-dark': '#4C1D95',
        // App backgrounds
        'app-bg': '#0F172A',
        'card-bg': '#1E293B',
        'surface': '#334155',
        // Status
        'status-active': '#4ADE80',
        'status-error': '#F87171',
        'status-pending': '#FACC15',
        'status-inactive': '#9CA3AF',
      },
      fontFamily: {
        'space-grotesk': ['SpaceGrotesk_400Regular'],
        'space-grotesk-medium': ['SpaceGrotesk_500Medium'],
        'space-grotesk-semibold': ['SpaceGrotesk_600SemiBold'],
        'space-grotesk-bold': ['SpaceGrotesk_700Bold'],
        'space-grotesk-extrabold': ['SpaceGrotesk_800ExtraBold'],
        'inter': ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
        'space-mono': ['SpaceMono_400Regular'],
      },
    },
  },
  plugins: [],
};
