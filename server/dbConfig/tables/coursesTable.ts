import { appPool } from "../";

export const createCoursesTable = async function () {
	//review status tell me whether a human had reviewed the course
	//to make sure it aligns
	try {
		await appPool.query(`
			CREATE TABLE IF NOT EXISTS courses (
				id 
						SERIAL PRIMARY KEY,
				name 
						TEXT NOT NULL UNIQUE,
				review_status 
						TEXT NOT NULL DEFAULT 'unreviewed'
			)
		`);
	} catch (error: any) {
		console.error("❌ Failed to create courses table:", error.message);
		throw error;
	}
};

export const createTopicsTable = async function () {
	try {
		await appPool.query(`
			CREATE TABLE IF NOT EXISTS topics (
				id 
						SERIAL PRIMARY KEY,
				course_id 
						INTEGER NOT NULL 
									REFERENCES courses(id) ON DELETE CASCADE,
				title 
						TEXT NOT NULL,
				lesson 
						TEXT NOT NULL
			)
		`);
	} catch (error: any) {
		console.error("❌ Failed to create topics table:", error.message);
		throw error;
	}
};

export const createPrerequisitesTable = async function () {
	try {
		await appPool.query(`
			CREATE TABLE IF NOT EXISTS prerequisites (
				topic_id 
						INTEGER NOT NULL 
									REFERENCES topics(id) ON DELETE CASCADE,
				required_topic_id 
						INTEGER NOT NULL 
									REFERENCES topics(id) ON DELETE CASCADE,
				PRIMARY KEY (topic_id, required_topic_id)
			)
		`);
	} catch (error: any) {
		console.error("❌ Failed to create prerequisites table:", error.message);
		throw error;
	}
};

export const createQuestionsTable = async function () {
	try {
		await appPool.query(`
			CREATE TABLE IF NOT EXISTS questions (
				id 
						SERIAL PRIMARY KEY,
				topic_id 
						INTEGER NOT NULL 
								REFERENCES topics(id) ON DELETE CASCADE,
				question 
						TEXT NOT NULL,
				answer 
						TEXT NOT NULL
			)
		`);
	} catch (error: any) {
		console.error("❌ Failed to create questions table:", error.message);
		throw error;
	}
};
