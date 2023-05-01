const { tailwindcssPaletteGenerator } = require('@bobthered/tailwindcss-palette-generator');
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/sveltewind/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: tailwindcssPaletteGenerator({
				colors: ['#4158D0', '#C850C0', '#7e8295'],
				names: ['primary', 'secondary', 'gray']
			}),
			fontFamily: {
				sans: ['Montserrat', 'sans-serif']
			}
		}
	},

	plugins: []
};

module.exports = config;
