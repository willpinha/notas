/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		container: {
			center: true,
		},
		extend: {
			animation: {
				"fade-in": "fadeIn 0.5s ease-in-out",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
