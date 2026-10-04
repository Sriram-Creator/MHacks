import { Router } from "express";
import { listMakers } from "../db.js";

export const makersRouter = Router();

/**
 * GET /makers
 * Returns all makers.
 */
makersRouter.get("/", async (_req, res) => {
  try {
    res.json(await listMakers());
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "DB error" });
  }
});
