import { Router } from "express";
import { computeForecast, getItemById } from "../db.js";
import type { Forecast } from "../types.js";

export const forecastRouter = Router();

// Fallback when there's neither order history nor a matching item.
const DEFAULT_FORECAST: Forecast = {
  suggested: 0,
  sold: 0,
  reason: "No forecast yet — list a few weeks to build history.",
};

/**
 * GET /forecast/:itemId
 * Computes the forecast from the item's seeded order history. For items
 * without history (e.g. just published), derives one from current capacity.
 */
forecastRouter.get("/:itemId", async (req, res) => {
  const { itemId } = req.params;

  try {
    const computed = await computeForecast(itemId);
    if (computed) {
      return res.json(computed);
    }

    const item = await getItemById(itemId);
    if (item) {
      return res.json({
        suggested: item.left_this_week,
        sold: 0,
        reason: `new listing — suggested from your capacity of ${item.left_this_week} this week`,
      } satisfies Forecast);
    }

    return res.json(DEFAULT_FORECAST);
  } catch (err) {
    return res
      .status(500)
      .json({ error: err instanceof Error ? err.message : "DB error" });
  }
});
