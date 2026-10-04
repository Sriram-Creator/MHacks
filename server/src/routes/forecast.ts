import { Router } from "express";
import type { Forecast } from "../types.js";

export const forecastRouter = Router();

// Mock forecast data keyed by itemId.
const MOCK_FORECASTS: Record<string, Forecast> = {
  default: {
    suggested: 40,
    sold: 38,
    reason: "12 regulars + rainy Saturday + last 3 weeks avg 36",
  },
  "sourdough-01": {
    suggested: 24,
    sold: 22,
    reason: "9 regulars + farmers market weekend + last 3 weeks avg 20",
  },
  "cookies-02": {
    suggested: 60,
    sold: 57,
    reason: "holiday demand + 15 pre-orders + last 3 weeks avg 52",
  },
};

/**
 * GET /forecast/:itemId
 * Returns mock sales forecast data.
 */
forecastRouter.get("/:itemId", (req, res) => {
  const { itemId } = req.params;
  const forecast = MOCK_FORECASTS[itemId] ?? MOCK_FORECASTS.default;
  return res.json(forecast);
});
