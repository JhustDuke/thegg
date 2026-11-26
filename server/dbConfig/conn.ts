import { Pool } from "pg";
import { useRuntimeConfig } from "#imports";
const runtimeConfig = useRuntimeConfig();

const databaseName = runtimeConfig.databaseName;

if (!databaseName || !/^[a-zA-Z0-9_]+$/.test(databaseName)) {
	throw new Error("❌ Invalid or missing DB_NAME in .env");
}

const databaseConnectionOptions = {
	host: runtimeConfig.databaseHost,
	user: runtimeConfig.databaseUser,
	password: runtimeConfig.databasePassword,
	port: runtimeConfig.databasePort,
};

// This pool connects to the PostgreSQL maintenance database.
const adminPool = new Pool({
	...databaseConnectionOptions,
	database: "postgres",
	max: 10,
});

// This pool connects to your application database.
export const appPool = new Pool({
	...databaseConnectionOptions,
	database: databaseName,
	max: 10,
});

export async function createDB(): Promise<void> {
	try {
		await adminPool.query(`CREATE DATABASE "${databaseName}"`);
		console.log(`✅ Database '${databaseName}' created.`);
	} catch (error: any) {
		if (error.code === "42P04") {
			console.log(`ℹ️ Database '${databaseName}' already exists.`);
			return;
		}

		console.error("❌ DB init error:", error.message);
		throw new Error(error.message);
	}
}
