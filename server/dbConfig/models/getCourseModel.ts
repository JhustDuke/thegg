import { appPool } from "../conn";

export const getCourseModel = async function (courseName: string) {
	try {
		const foundCourse = await appPool.query(
			"SELECT * FROM courses WHERE name = $1",
			[courseName]
		);

		if (foundCourse.rows.length === 0) {
			return null;
		}

		const course = foundCourse.rows[0];

		const foundTopics = await appPool.query(
			"SELECT * FROM topics WHERE course_id = $1 ORDER BY id",
			[course.id]
		);

		return {
			...course,
			topics: foundTopics.rows,
		};
	} catch (error: any) {
		console.error("❌ Failed to get course:", error.message);
		throw error;
	}
};
