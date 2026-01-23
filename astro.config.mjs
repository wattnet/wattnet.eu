// @ts-check
import { defineConfig } from "astro/config";
import alpinejs from "@astrojs/alpinejs";
import preact from "@astrojs/preact";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	integrations: [alpinejs(), preact()],

	vite: {
		plugins: [tailwindcss()],
	},
});
