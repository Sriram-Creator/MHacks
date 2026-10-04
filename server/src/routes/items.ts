import { Router } from "express";
import { randomUUID } from "node:crypto";
import { items } from "../store.js";
import type { Item } from "../types.js";

export const itemsRouter = Router();

/**
 * GET /items
 * Returns all marketplace items.
 */
itemsRouter.get("/", (_req, res) => {
  res.json(items);
});

/**
 * POST /items
 * Body: {
 *   name, category, description?, price, ingredients[]?, allergens[]?,
 *   left_this_week?, capacity?, maker?, makerId?, photo?
 * }
 * Pushes a new item to the in-memory array and returns the created item.
 */
itemsRouter.post("/", (req, res) => {
  const body = req.body ?? {};

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return res.status(400).json({ error: "Missing required field: name." });
  }

  const price = Number(body.price);
  if (!Number.isFinite(price) || price < 0) {
    return res
      .status(400)
      .json({ error: "price must be a non-negative number." });
  }

  const asStringArray = (value: unknown): string[] =>
    Array.isArray(value) ? value.map((entry) => String(entry)) : [];

  // left_this_week comes from the maker's capacity field; fall back sensibly.
  const rawCapacity =
    body.left_this_week ?? body.capacity ?? body.suggested ?? 0;
  const capacity = Math.max(0, Math.trunc(Number(rawCapacity)) || 0);

  const item: Item = {
    id: `item-${randomUUID()}`,
    name,
    maker: typeof body.maker === "string" && body.maker ? body.maker : "You",
    makerId:
      typeof body.makerId === "string" && body.makerId ? body.makerId : "me",
    category: typeof body.category === "string" ? body.category : "other",
    price,
    allergens: asStringArray(body.allergens),
    left_this_week: capacity,
    photo: typeof body.photo === "string" ? body.photo : "",
  };

  items.push(item);

  return res.status(201).json(item);
});
