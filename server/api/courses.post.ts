import { defineEventHandler, readBody, createError } from "h3";

import { createCourseModel, throwIfCourseExists } from "../dbConfig/models";
import { generateCourseTopics } from "../aiPromptConfig";

interface CourseRequest {
	name: string;
}

export default defineEventHandler(async function (event) {
	try {
		const requestBody = await readBody<CourseRequest>(event);

		if (!requestBody.name || typeof requestBody.name !== "string") {
			throw createError({
				statusCode: 400,
				statusMessage: "Course name is required",
			});
		}

		const courseName = requestBody.name.trim().toLowerCase();

		await throwIfCourseExists(courseName).catch(function (error) {
			// duplicate e.g. 'Course "Sociology" already exists'
			if (error.message.includes("already exists")) {
				throw createError({
					statusCode: 409,
					statusMessage: error.message,
				});
			}

			throw error;
		});

		const generatedTopics = await generateCourseTopics(courseName);

		const courseId = await createCourseModel(courseName, generatedTopics);

		return {
			success: true,
			message: "Course created successfully",
			courseId,
			name: courseName,
			topics: generatedTopics,
		};
	} catch (error: any) {
		console.error("❌ Failed to create course:", error.message);

		if (error.statusCode) {
			throw error;
		}

		throw createError({
			statusCode: 500,
			message: error.message || "Failed to create course",
		});
	}
});
