import { Router } from "express";
import { getUser, updateUser } from "../db.js";
import type { User } from "../types.js";

export const usersRouter = Router();

// Fields a client is allowed to update.
const EDITABLE_FIELDS: (keyof Omit<User, "id">)[] = [
  "name",
  "phone",
  "email",
  "address",
  "bio",
  "photo",
];

/**
 * GET /users/:id
 * Returns the user, creating an empty row first if it doesn't exist.
 */
usersRouter.get("/:id", async (req, res) => {
  try {
    res.json(await getUser(req.params.id));
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "DB error" });
  }
});

/**
 * PATCH /users/:id
 * Updates the provided account fields and returns the updated user.
 */
usersRouter.patch("/:id", async (req, res) => {
  const body = req.body ?? {};
  const patch: Partial<User> = {};

  for (const field of EDITABLE_FIELDS) {
    if (typeof body[field] === "string") {
      patch[field] = body[field];
    }
  }

  try {
    res.json(await updateUser(req.params.id, patch));
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "DB error" });
  }
});
