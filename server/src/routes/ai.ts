import { Router } from "express";
import { cottageAgentReply } from "../cottageAgent.js";
import { generateListing, isMockMode } from "../vision.js";
import { checkLegality } from "../rules.js";

export const aiRouter = Router();

/**
 * POST /ai/agent
 * Body: { question: string }
 * Same replies as fetch_agent/agent.py / the Agentverse agent.
 */
aiRouter.post("/agent", (req, res) => {
  const question = req.body?.question;
  if (typeof question !== "string" || question.trim().length === 0) {
    return res.status(400).json({ error: "Missing required field: question" });
  }
  const answer = cottageAgentReply(question);
  return res.json({ answer, status: "ok" });
});

/**
 * POST /ai/listing
 * Body: { image?: string (base64 or data URL), state: string, hint?: string }
 *
 * In MOCK mode (MOCK_AI=true or no NVIDIA_API_KEY) the image is optional and a
 * hardcoded listing is returned based on `hint`. In LIVE mode the image is
 * required and sent to NVIDIA NIM's vision API. Either way the real legality
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
