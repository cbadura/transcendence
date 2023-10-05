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
      }
    },
  },
  plugins: [],
}

