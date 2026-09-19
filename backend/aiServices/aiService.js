import dotenv from 'dotenv';
dotenv.config();
import { Groq } from "groq-sdk/client.js";
import { jsonSchema, buildExtractionPrompt } from "./prompts/extractionPrompt.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function processCommunication(rawText,referenceDate = new Date(),memberNames=[]) {
  try {
    const formattedDate = referenceDate.toISOString().split('T')[0]; // "2026-09-13"
    const systemPrompt = buildExtractionPrompt(formattedDate,memberNames);

      const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: rawText }
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "project_extraction", strict: true, schema: jsonSchema }
      },
      temperature: 0.1
    });

  return JSON.parse(response.choices[0].message.content);
  
  } catch (error) {
    console.error("AI Extraction Error:", error);
    throw new Error("Failed to process communication text.");
  }
}