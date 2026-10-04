import { Router } from "express";
import { meetupSpots } from "../store.js";

export const meetupSpotsRouter = Router();

/**
 * GET /meetup-spots
 * Returns the public Ann Arbor meetup spots.
 */
meetupSpotsRouter.get("/", (_req, res) => {
  res.json(meetupSpots);
});
