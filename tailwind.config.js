module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily:{
      sans: ['Poppins', 'sans-serif']
    },
    extend: {
      colors:{
        'tangerine':{
          '500':'#f18805'
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
