import OpenAI from "openai";
import { config } from "../config.js";

function createClient() {
  if (config.aiProvider === "groq" && config.groqApiKey) {
    return {
      model: config.groqModel,
      client: new OpenAI({
        apiKey: config.groqApiKey,
        baseURL: "https://api.groq.com/openai/v1"
      })
    };
  }

  if (config.openaiApiKey) {
    return {
      model: config.openaiModel,
      client: new OpenAI({ apiKey: config.openaiApiKey })
    };
  }

  return { model: null, client: null };
}

const ai = createClient();

export function hasAI() {
  return Boolean(ai.client && ai.model);
}

export async function askAI(prompt) {
  if (!hasAI()) {
    throw new Error("Missing AI API key. Add GROQ_API_KEY or OPENAI_API_KEY to .env");
  }

  const response = await ai.client.chat.completions.create({
    model: ai.model,
    messages: [
      {
        role: "system",
        content: "You are a helpful Discord assistant. Reply in Vietnamese by default. Keep answers concise and Discord-friendly."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 800
  });

  return response.choices.at(0)?.message?.content?.trim() || "AI khong tra ve noi dung.";
}
