/**
 * Manual test for POST /ai/listing.
 *
 * Usage:
 *   npm run test:ai -- <path-to-image> [hint]
 *
 * Reads the image file, base64-encodes it, POSTs it to the running server
 * (http://localhost:3001) with state "MI", and prints the full response.
 * The optional `hint` is used when the server runs in MOCK_AI mode.
 */
import { readFile } from "node:fs/promises";
import { extname, basename } from "node:path";

const API_URL = process.env.API_URL ?? "http://localhost:3001/ai/listing";
const STATE = "MI";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

async function main(): Promise<void> {
  const imagePath = process.argv[2];
  const hint = process.argv[3];

  if (!imagePath) {
    console.error("Usage: npm run test:ai -- <path-to-image> [hint]");
    process.exit(1);
  }

  let buffer: Buffer;
  try {
    buffer = await readFile(imagePath);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Could not read image "${imagePath}": ${message}`);
    process.exit(1);
  }

  const mimeType = MIME_BY_EXT[extname(imagePath).toLowerCase()] ?? "image/jpeg";
  const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

  console.log(`Image:  ${basename(imagePath)} (${mimeType}, ${buffer.length} bytes)`);
  console.log(`State:  ${STATE}`);
  if (hint) console.log(`Hint:   ${hint}`);
  console.log(`POST -> ${API_URL}\n`);

  let res: Response;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: dataUrl, state: STATE, hint }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Request failed (is the server running?): ${message}`);
    process.exit(1);
  }

  const text = await res.text();
  let output = text;
  try {
    output = JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    // leave as raw text if not JSON
  }

  console.log(`HTTP ${res.status} ${res.statusText}`);
  console.log(output);

  if (!res.ok) process.exit(1);
}

main();
