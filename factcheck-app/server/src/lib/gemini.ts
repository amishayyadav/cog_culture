import { GoogleGenerativeAI } from "@google/generative-ai";

let _client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    _client = new GoogleGenerativeAI(apiKey);
  }
  return _client;
}

export const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

/**
 * Generate JSON output from Gemini using native JSON mode.
 */
export async function generateJSON<T = unknown>(
  prompt: string,
  maxOutputTokens = 4000,
): Promise<T> {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens,
      temperature: 0.2,
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text) throw new Error("Empty response from Gemini");

  try {
    return JSON.parse(text) as T;
  } catch {
    const m = text.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (m) return JSON.parse(m[1]) as T;
    throw new Error(`Could not parse Gemini output as JSON: ${text.slice(0, 200)}`);
  }
}
