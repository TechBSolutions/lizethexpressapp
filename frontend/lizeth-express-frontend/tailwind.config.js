/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],  
  theme: {
    extend: {
      colors: {
        primary: '#003f49',
        bglw1: '#5e99aa',
        bglw2: '#004459',
        secondary: '#00607c',
        accent: '#006d66',
        background: '#c9e8dd',
        bghome :'#008272',
        darkText: '#00493f',
        secondbg :'#9bc4e2',
      },
    },
  },
  plugins: [],
}
