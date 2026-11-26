import type { PoolClient } from "pg";
import { appPool } from "../conn";

export interface TopicToCreate {
	title: string;
	lesson: string;
}

// creates the course and all its topics, or nothing if any insert fails
export const createCourseModel = async function (
	courseName: string,
	topicsToCreate: TopicToCreate[]
) {
	const transactionConnection = await appPool.connect();
	const course_name = courseName.toLowerCase();
	try {
		await transactionConnection.query("BEGIN");

		const insertedCourse = await transactionConnection.query(
			"INSERT INTO courses (name) VALUES ($1) RETURNING id",
			[course_name]
		);
		const insertedCourseId = insertedCourse.rows[0].id;

		await createTopics({
			transactionConnection,
			courseId: insertedCourseId,
			topicsToCreate,
		});

		await transactionConnection.query("COMMIT");
		return insertedCourseId;
	} catch (error: any) {
		await transactionConnection.query("ROLLBACK");

		if (error.code === "23505") {
			throw new Error(
				"This course already exists. Change the name if you're looking for a different course."
			);
		}

		console.error("❌ Failed to create course and topics:", error.message);
		throw error;
	} finally {
		transactionConnection.release();
	}
};

interface CreateTopicsParams {
	transactionConnection: PoolClient;
	courseId: number;
	topicsToCreate: TopicToCreate[];
}

// uses the same connection as createCourseModel so a failure here also undoes the course
const createTopics = async function ({
	transactionConnection,
	courseId,
	topicsToCreate,
}: CreateTopicsParams) {
	for (let topicIndex = 0; topicIndex < topicsToCreate.length; topicIndex++) {
		const topic = topicsToCreate[topicIndex];
		if (!topic) {
			throw new Error(`Topic at index ${topicIndex} is undefined`);
		}

		await transactionConnection.query(
			"INSERT INTO topics (course_id, title, lesson) VALUES ($1, $2, $3)",
			[courseId, topic.title, topic.lesson]
		);
	}
};
