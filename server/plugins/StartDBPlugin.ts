// server/plugins/init-database.ts
import { createDB, initTables } from "../dbConfig";
import { defineNitroPlugin } from "#imports";

export default defineNitroPlugin(async function () {
	await createDB();
	await initTables();
});
