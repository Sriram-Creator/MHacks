import { Router } from "express";
import { makers } from "../store.js";

export const makersRouter = Router();

/**
 * GET /makers
 * Returns all makers.
 */
makersRouter.get("/", (_req, res) => {
  res.json(makers);
});
