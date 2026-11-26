import { GoogleGenAI } from "@google/genai";
import { defineEventHandler, useRuntimeConfig } from "#imports";

export default defineEventHandler(async function () {
	const geminiKey = useRuntimeConfig().geminiKey;
	const geminiClient = new GoogleGenAI({ apiKey: geminiKey });

	const geminiResponse = await geminiClient.models.generateContent({
		model: "gemini-3.1-flash-lite",
		contents: "Reply with the single word: working",
	});

	return { reply: geminiResponse.text };
});
