// @ts-check
import { defineConfig } from "astro/config";
import alpinejs from "@astrojs/alpinejs";
import preact from "@astrojs/preact";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://wattnet.eu",
	integrations: [alpinejs(), preact(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
});
