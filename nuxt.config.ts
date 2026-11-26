// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		// private: server only, never sent to the browser
		geminiKey: process.env.GEMINI_API_KEY,
		databaseHost: process.env.DB_HOST,
		databasePort: Number(process.env.DB_PORT) || 5432,
		databaseUser: process.env.DB_USER,
		databasePassword: process.env.DB_PASS,
		databaseName: process.env.DB_NAME,
	},
	app: {
		head: {
			link: [
				{
					rel: "icon",
					type: "image/png",
					href: "/favicon.png",
				},
			],
		},
	},
	css: [
		"bootstrap/dist/css/bootstrap.min.css",
		"materializecss-colors-alone/colors.css",
	],

	compatibilityDate: "2025-07-15",

	devtools: {
		enabled: false,
	},

	typescript: {
		shim: false,
	},

	devServer: {
		port: 3331,
	},

	imports: {
		autoImport: false,
	},

	modules: ["@pinia/nuxt"],
});
