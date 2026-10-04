import { Router } from "express";
import { getForecast, getItemById } from "../db.js";
import type { Forecast } from "../types.js";

export const forecastRouter = Router();

// Fallback when neither a stored forecast nor a matching item exists.
const DEFAULT_FORECAST: Forecast = {
  suggested: 0,
  sold: 0,
  reason: "No forecast yet — list a few weeks to build history.",
};

/**
 * GET /forecast/:itemId
 * Returns the item's stored forecast. For items without one (e.g. just
 * published), derives a forecast from the item's current capacity.
 */
forecastRouter.get("/:itemId", async (req, res) => {
  const { itemId } = req.params;

  try {
    const stored = await getForecast(itemId);
    if (stored) {
      return res.json(stored);
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
