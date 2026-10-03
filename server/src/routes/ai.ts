import { Router } from "express";
import { generateListing, isMockMode } from "../vision.js";
import { checkLegality } from "../rules.js";

export const aiRouter = Router();

/**
 * POST /ai/listing
 * Body: { image?: string (base64 or data URL), state: string, hint?: string }
 *
 * In MOCK mode (MOCK_AI=true or no GEMINI_API_KEY) the image is optional and a
 * hardcoded listing is returned based on `hint`. In LIVE mode the image is
 * required and sent to the Gemini vision API. Either way the real legality
 * check runs on the result.
 *
 * Returns: { ...listing, legality, mode }
 */
aiRouter.post("/listing", async (req, res) => {
  const { image, state, hint } = req.body ?? {};

  if (typeof state !== "string" || state.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "Missing required field: state (e.g. \"MI\")." });
  }

  const { mock } = isMockMode();

  // In live mode an image is required; in mock mode it is optional.
  if (!mock && (typeof image !== "string" || image.length === 0)) {
    return res
      .status(400)
      .json({ error: "Missing required field: image (base64 string)." });
  }

  try {
    const listing = await generateListing({
      image: typeof image === "string" ? image : undefined,
      state,
      hint: typeof hint === "string" ? hint : undefined,
    });
    const legality = checkLegality(listing, state);

    return res.json({ ...listing, legality, mode: mock ? "mock" : "live" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.startsWith("Missing required field") ? 400 : 502;
    return res.status(status).json({ error: message });
  }
});
