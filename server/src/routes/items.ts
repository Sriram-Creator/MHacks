import { Router } from "express";
import { items } from "../store.js";

export const itemsRouter = Router();

/**
 * GET /items
 * Returns all marketplace items.
 */
itemsRouter.get("/", (_req, res) => {
  res.json(items);
});
