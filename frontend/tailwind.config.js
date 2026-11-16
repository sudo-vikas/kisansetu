/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f2fbf4',
          100: '#e1f6e6',
          200: '#c4ecd0',
          300: '#97dcac',
          400: '#62c381',
          500: '#3ba75e',
          600: '#2c8749',
          700: '#256b3c',
          800: '#1b4332', // Deep forest harvest green
          900: '#183f2a',
          950: '#0c2217',
        },
        wheat: {
          50: '#fdfbf6',
          100: '#faf5eb',
          200: '#f3e8d2',
          300: '#e9d4ad',
          400: '#dcb881',
          500: '#d4a373', // Rich golden grain amber
          600: '#bf844f',
          700: '#9f663c',
          800: '#805235',
          900: '#69442e',
        },
        soil: {
          50: '#f9f6f3',
          100: '#f1ede6',
          200: '#e3d9cb',
          500: '#8c6b4f',
          800: '#4a3828',
          900: '#2b2016',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
