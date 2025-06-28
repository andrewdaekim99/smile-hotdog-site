/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-orange': '#EA9841',
        'primary-cream': '#F5F5DC',
        'primary-green': '#1D4E1A',
        'primary-dark': '#2C1810',
      }
    },
  },
  plugins: [],
} 