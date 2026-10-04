import type { Listing } from "./types.js";
import { mockListing } from "./mock.js";

const SYSTEM_PROMPT = `You are an assistant for a cottage-food marketplace. You look at a photo of a homemade food item and produce a marketplace listing.

Respond with ONLY a JSON object (no markdown, no prose) with exactly these keys:
{
  "name": string,              // short product name
  "category": string,          // e.g. "baked goods", "jam", "candy", "pickles"
  "description": string,       // 1-2 appealing sentences for a buyer
  "suggested_price": number,   // a reasonable USD price, number only
  "ingredients": string[],     // likely ingredients
  "allergens": string[]        // common allergens present (e.g. "wheat", "eggs", "dairy", "nuts")
}`;

export interface GenerateListingInput {
  image?: string;
  state: string;
  hint?: string;
}

/**
 * Decides whether we run the real Gemini call or return a mock listing.
 * Mock mode is active when MOCK_AI=true or no GEMINI_API_KEY is configured.
 */
export function isMockMode(): { mock: boolean; reason: string } {
  if (process.env.MOCK_AI === "true") {
    return { mock: true, reason: "MOCK_AI=true" };
  }
  if (!process.env.GEMINI_API_KEY) {
    return { mock: true, reason: "GEMINI_API_KEY not set" };
  }
  return { mock: false, reason: "GEMINI_API_KEY present" };
}

function splitDataUrl(image: string): { mimeType: string; data: string } {
  // Accept either a raw base64 string or a full data URL.
  const match = /^data:(.+?);base64,(.*)$/s.exec(image);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  return { mimeType: "image/jpeg", data: image };
}

function coerceListing(obj: Record<string, unknown>): Listing {
  const asArray = (v: unknown): string[] =>
    Array.isArray(v) ? v.map((x) => String(x)) : [];

  const price = Number(obj.suggested_price);

  return {
    name: String(obj.name ?? "Homemade item"),
    category: String(obj.category ?? "other"),
    description: String(obj.description ?? ""),
    suggested_price: Number.isFinite(price) ? price : 0,
    ingredients: asArray(obj.ingredients),
    allergens: asArray(obj.allergens),
  };
}

/**
 * Produces a structured listing for an item.
 *
 * - In MOCK mode: returns a realistic hardcoded listing based on `hint`.
 * - In LIVE mode: sends the image to the Gemini vision API.
 *
 * Logs clearly which mode is active either way.
 */
export async function generateListing(
  input: GenerateListingInput,
): Promise<Listing> {
  const { image, state, hint } = input;
  const { mock, reason } = isMockMode();

  if (mock) {
    console.log(`[AI] MOCK mode active (${reason}) — hint="${hint ?? ""}"`);
    return mockListing(hint);
  }

  if (!image) {
    throw new Error("Missing required field: image (base64 string).");
  }

  const apiKey = process.env.GEMINI_API_KEY as string;
  const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
  console.log(`[AI] LIVE mode active (Gemini ${model})`);

  const { mimeType, data } = splitDataUrl(image);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nThis homemade food will be sold in ${state}. Analyze the photo and produce the listing JSON.`,
            },
            { inline_data: { mime_type: mimeType, data } },
          ],
        },
      ],
      generationConfig: { responseMimeType: "application/json" },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini request failed (${res.status}): ${detail}`);
  }

  const body = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const content = body.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error("Gemini returned an empty response.");
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Gemini did not return valid JSON: ${content}`);
  }

  return coerceListing(parsed);
}
