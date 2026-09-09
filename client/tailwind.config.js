/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#EC4899',
        dark: '#1F2937',
        light: '#F9FAFB',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
