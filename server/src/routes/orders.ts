import { Router } from "express";
import { randomUUID } from "node:crypto";
import { findItem, findSpot, orders } from "../store.js";
import type { Order } from "../types.js";

export const ordersRouter = Router();

/**
 * GET /orders
 * Returns all placed orders (in-memory).
 */
ordersRouter.get("/", (_req, res) => {
  res.json(orders);
});

/**
 * POST /orders
 * Body: { itemId: string, quantity?: number, buyerName?: string, meetupSpotId?: string }
 * Decrements the item's left_this_week and records the order.
 * Returns: { id, ...order }
 */
ordersRouter.post("/", (req, res) => {
  const { itemId, quantity, buyerName, meetupSpotId } = req.body ?? {};

  if (typeof itemId !== "string" || itemId.length === 0) {
    return res.status(400).json({ error: "Missing required field: itemId." });
  }

  const qty = quantity === undefined ? 1 : Number(quantity);
  if (!Number.isInteger(qty) || qty < 1) {
    return res
      .status(400)
      .json({ error: "quantity must be a positive integer." });
  }

  const item = findItem(itemId);
  if (!item) {
    return res.status(404).json({ error: `Item "${itemId}" not found.` });
  }

  if (meetupSpotId !== undefined && meetupSpotId !== null) {
    if (typeof meetupSpotId !== "string" || !findSpot(meetupSpotId)) {
      return res
        .status(400)
        .json({ error: `Unknown meetupSpotId "${meetupSpotId}".` });
    }
  }

  if (item.left_this_week < qty) {
    return res.status(409).json({
      error: `Only ${item.left_this_week} of "${item.name}" left this week.`,
    });
  }

  // Decrement stock.
  item.left_this_week -= qty;

  const order: Order = {
    id: randomUUID(),
    itemId: item.id,
    itemName: item.name,
    quantity: qty,
    unit_price: item.price,
    total: item.price * qty,
    buyerName: typeof buyerName === "string" ? buyerName : "Anonymous",
    meetupSpotId:
      typeof meetupSpotId === "string" ? meetupSpotId : null,
    createdAt: new Date().toISOString(),
  };

  orders.push(order);

  return res.status(201).json(order);
});
