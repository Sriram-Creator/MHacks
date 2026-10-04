import { Router } from "express";
import { randomUUID } from "node:crypto";
import { insertForecast, insertItem, listItems } from "../db.js";
import type { Item } from "../types.js";

export const itemsRouter = Router();

/**
 * GET /items
 * Returns all marketplace items.
 */
itemsRouter.get("/", async (_req, res) => {
  try {
    res.json(await listItems());
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "DB error" });
  }
});

/**
 * POST /items
 * Body: {
 *   name, category, description?, price, ingredients[]?, allergens[]?,
 *   left_this_week?, capacity?, maker?, makerId?, photo?
 * }
 * Inserts a new item and returns the created item.
 */
itemsRouter.post("/", async (req, res) => {
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

  try {
    const created = await insertItem(item);
    // Give the new listing its own forecast derived from its capacity,
    // instead of falling back to a shared default.
    await insertForecast(
      created.id,
      created.left_this_week,
      0,
      `new listing — based on your capacity of ${created.left_this_week} this week`,
    );
    return res.status(201).json(created);
  } catch (err) {
    return res
      .status(500)
      .json({ error: err instanceof Error ? err.message : "DB error" });
  }
});
