/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ETF-test brand colors
        primary: {
          DEFAULT: '#28EBCF',
          dark: '#20D4BA',
          light: '#5FF0DC',
        },
        // Dark theme colors
        dark: {
          bg: '#0A0B0D',
          card: '#1A1B1F',
          border: '#2A2B2F',
          surface: '#0F1014',
        },
        // Risk colors for compliance
        risk: {
          low: '#22C55E',
          medium: '#F59E0B',
          high: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
