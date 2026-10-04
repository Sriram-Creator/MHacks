import { Router } from "express";
import { randomUUID } from "node:crypto";
import {
  getItemById,
  insertOrder,
  listOrders,
  spotExists,
  tryDecrementItem,
} from "../db.js";

export const ordersRouter = Router();

/**
 * GET /orders
 * Returns all placed orders.
 */
ordersRouter.get("/", async (_req, res) => {
  try {
    res.json(await listOrders());
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "DB error" });
  }
});

/**
 * POST /orders
 * Body: { itemId: string, quantity?: number, buyerName?: string, meetupSpotId?: string }
 * Decrements the item's left_this_week and records the order.
 * Returns: { id, ...order }
 */
ordersRouter.post("/", async (req, res) => {
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

  try {
    const item = await getItemById(itemId);
    if (!item) {
      return res.status(404).json({ error: `Item "${itemId}" not found.` });
    }

    if (meetupSpotId !== undefined && meetupSpotId !== null) {
      if (typeof meetupSpotId !== "string" || !(await spotExists(meetupSpotId))) {
        return res
          .status(400)
          .json({ error: `Unknown meetupSpotId "${meetupSpotId}".` });
      }
    }

    // Atomic conditional decrement.
    const decremented = await tryDecrementItem(itemId, qty);
    if (!decremented) {
      return res.status(409).json({
        error: `Only ${item.left_this_week} of "${item.name}" left this week.`,
      });
    }

    const order = await insertOrder({
      id: randomUUID(),
      itemId: item.id,
      itemName: item.name,
      quantity: qty,
      unitPrice: item.price,
      total: item.price * qty,
      buyerName: typeof buyerName === "string" ? buyerName : "Anonymous",
      meetupSpotId: typeof meetupSpotId === "string" ? meetupSpotId : null,
    });

    return res.status(201).json(order);
  } catch (err) {
    return res
      .status(500)
      .json({ error: err instanceof Error ? err.message : "DB error" });
  }
});
