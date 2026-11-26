import { appPool } from "../conn";

export const dropTables = async function () {
	await appPool.query(`
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
    `);
};
