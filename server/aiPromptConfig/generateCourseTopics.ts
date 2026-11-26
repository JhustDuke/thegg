import { GoogleGenAI } from "@google/genai";
import { useRuntimeConfig } from "#imports";

export interface GeneratedTopic {
	title: string;
	lesson: string;
}

export const generateCourseTopics = async function (courseName: string) {
	const geminiClient = new GoogleGenAI({
		apiKey: useRuntimeConfig().geminiKey,
	});

	const geminiResponse = await geminiClient.models.generateContent({
		model: "gemini-3.1-flash-lite",
		contents: `
  Create a beginner course called "${courseName}".
   Return JSON only, in exactly this shape: {"topics":[{"title":"...","lesson":"..."}]}. 
   Return exactly 2 topics. Each lesson is plain text,
  3 to 5 sentences.`,
		config: { responseMimeType: "application/json" },
	});

	let parsedCourse: any;
	try {
		parsedCourse = JSON.parse(geminiResponse.text ?? "");
	} catch (error: any) {
		throw new Error("Gemini did not return valid JSON");
	}

	// shape check, so a bad answer never reaches the DB
	if (
		!parsedCourse ||
		!Array.isArray(parsedCourse.topics) ||
		parsedCourse.topics.length === 0
	) {
		throw new Error("Gemini answer has no topics list");
	}

	const generatedTopics: GeneratedTopic[] = [];
	for (
		let topicIndex = 0;
		topicIndex < parsedCourse.topics.length;
		topicIndex++
	) {
		const rawTopic = parsedCourse.topics[topicIndex];

		if (
			typeof rawTopic.title !== "string" ||
			typeof rawTopic.lesson !== "string"
		) {
			throw new Error(
				`Gemini topic ${topicIndex} is missing a title or lesson`
			);
		}

		generatedTopics.push({ title: rawTopic.title, lesson: rawTopic.lesson });
	}

	return generatedTopics;
};
