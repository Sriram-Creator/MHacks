import type { Listing } from "./types.js";
import { mockListing } from "./mock.js";

const SYSTEM_PROMPT = `You are an assistant for a cottage-food marketplace. You look at a photo of a homemade food item and produce a marketplace listing.

Respond with ONLY a JSON object (no markdown, no prose, no code fences) with exactly these keys:
{
  "name": string,              // short product name
  "category": string,          // e.g. "baked goods", "jam", "candy", "pickles"
  "description": string,       // 1-2 appealing sentences for a buyer
  "suggested_price": number,   // a reasonable USD price, number only
  "ingredients": string[],     // likely ingredients
  "allergens": string[]        // common allergens present (e.g. "wheat", "eggs", "dairy", "nuts")
}`;

const NVIDIA_BASE_URL =
  process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1";
const DEFAULT_MODEL = "meta/llama-3.2-11b-vision-instruct";

export interface GenerateListingInput {
  image?: string;
  state: string;
  hint?: string;
}

/**
 * Decides whether we run the real NVIDIA NIM call or return a mock listing.
 * Mock mode is active when MOCK_AI=true or no NVIDIA_API_KEY is configured.
 */
export function isMockMode(): { mock: boolean; reason: string } {
  if (process.env.MOCK_AI === "true") {
    return { mock: true, reason: "MOCK_AI=true" };
  }
  if (!process.env.NVIDIA_API_KEY) {
    return { mock: true, reason: "NVIDIA_API_KEY not set" };
  }
  return { mock: false, reason: "NVIDIA_API_KEY present" };
}

function toDataUrl(image: string): string {
  // Accept either a raw base64 string or a full data URL.
  if (image.startsWith("data:")) {
    return image;
  }
  return `data:image/jpeg;base64,${image}`;
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
 * Parses the model's text output into an object, tolerating markdown code
 * fences or surrounding prose by extracting the first JSON object.
 */
function parseJsonLoose(content: string): Record<string, unknown> {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = /\{[\s\S]*\}/.exec(cleaned);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error(`Model did not return valid JSON: ${content}`);
  }
}

/**
 * Produces a structured listing for an item.
 *
 * - In MOCK mode: returns a realistic hardcoded listing based on `hint`.
 * - In LIVE mode: sends the image to NVIDIA NIM's OpenAI-compatible vision API.
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

  const apiKey = process.env.NVIDIA_API_KEY as string;
  const model = process.env.NVIDIA_MODEL ?? DEFAULT_MODEL;
  console.log(`[AI] LIVE mode active (NVIDIA NIM ${model})`);

  const dataUrl = toDataUrl(image);

  const res = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 512,
      temperature: 0.2,
      top_p: 0.7,
      // Only user-role messages support content arrays on NVIDIA NIM;
      // system/assistant roles must use plain string content.
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `This homemade food will be sold in ${state}. Analyze the photo and produce the listing JSON.`,
            },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`NVIDIA NIM request failed (${res.status}): ${detail}`);
  }

  const body = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = body.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("NVIDIA NIM returned an empty response.");
  }

  return coerceListing(parseJsonLoose(content));
}
