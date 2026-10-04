import { Router } from "express";
import { listMeetupSpots } from "../db.js";

export const meetupSpotsRouter = Router();

/**
 * GET /meetup-spots
 * Returns the public Ann Arbor meetup spots.
 */
meetupSpotsRouter.get("/", async (_req, res) => {
  try {
    res.json(await listMeetupSpots());
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "DB error" });
  }
});
