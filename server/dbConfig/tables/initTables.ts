import {
	createCoursesTable,
	createTopicsTable,
	createPrerequisitesTable,
	createQuestionsTable,
} from "./coursesTable";

import { dropTables } from "./dropTable";

export const initTables = async function () {
	// order matters: later tables point at earlier ones
	await createCoursesTable();
	await createTopicsTable();
	//await createPrerequisitesTable();
	//await createQuestionsTable();

	console.log("all Tables ready");
};
