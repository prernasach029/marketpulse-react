/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A0F1E',
        'navy-2': '#0E1426',
        panel: '#111932',
        'panel-2': '#0D1424',
        line: '#1E2A48',
        accent: '#2563EB',
        'txt-1': '#E7ECF6',
        'txt-2': '#9AA6C2',
        'txt-3': '#5E6C8C',
        up: '#16C77E',
        down: '#F0455E',
        amber: '#E0A33B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}