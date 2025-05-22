/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007BFF',
        secondary: '#6C757D',
        success: '#28A745',
        danger: '#DC3545',
        warning: '#FFC107',
        info: '#17A2B8',
        light: '#F8F9FA',
        dark: '#343A40',
        background: '#FFFFFF',
        text: '#212529',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Example, assuming Inter is available or will be imported
      },
    },
  },
  plugins: [],
}
