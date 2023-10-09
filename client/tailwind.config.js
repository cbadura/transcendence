/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
			'Inter': ['Inter', 'sans-serif'],
		  	'Sniglet': ['Sniglet', 'cursive'],
      },
      spacing: {
        'full-header' : 'calc(100vh - 80px)',
      }
    },
  },
  plugins: [],
}

