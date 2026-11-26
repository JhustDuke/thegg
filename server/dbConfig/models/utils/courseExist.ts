import { getCourseModel } from "../";

// stops duplicate courses early e.g. "Sociology" already saved
export const throwIfCourseExists = async function (courseName: string) {
	const existingCourse = await getCourseModel(courseName);

	if (existingCourse) {
		throw new Error(`Course "${courseName}" already exists`);
	}
};
