import { neon } from "@neondatabase/serverless";
import {
  items as seedItems,
  makers as seedMakers,
  meetupSpots as seedSpots,
} from "./store.js";
import type { Forecast, Item, Maker, MeetupSpot, Order, User } from "./types.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add your Neon connection string to /server/.env.",
  );
}

export const sql = neon(connectionString);

// --- Row mappers (keep API response shapes identical) ----------------------

type Row = Record<string, unknown>;

function rowToMaker(r: Row): Maker {
  return {
    id: String(r.id),
    name: String(r.name),
    bio: String(r.bio ?? ""),
    location: String(r.location ?? ""),
    photo: String(r.photo ?? ""),
    rating: Number(r.rating),
  };
}

function rowToItem(r: Row): Item {
  return {
    id: String(r.id),
    name: String(r.name),
    maker: String(r.maker ?? ""),
    makerId: String(r.maker_id ?? ""),
    category: String(r.category ?? "other"),
    price: Number(r.price),
    allergens: Array.isArray(r.allergens) ? (r.allergens as string[]) : [],
    left_this_week: Number(r.left_this_week),
    photo: String(r.photo ?? ""),
  };
}

function rowToSpot(r: Row): MeetupSpot {
  return {
    id: String(r.id),
    name: String(r.name),
    address: String(r.address ?? ""),
    lat: Number(r.lat),
    lng: Number(r.lng),
    notes: String(r.notes ?? ""),
  };
}

function rowToOrder(r: Row): Order {
  return {
    id: String(r.id),
    itemId: String(r.item_id),
    itemName: String(r.item_name),
    quantity: Number(r.quantity),
    unit_price: Number(r.unit_price),
    total: Number(r.total),
    buyerName: String(r.buyer_name),
    meetupSpotId: r.meetup_spot_id == null ? null : String(r.meetup_spot_id),
    createdAt: new Date(r.created_at as string).toISOString(),
  };
}

function rowToForecast(r: Row): Forecast {
  return {
    suggested: Number(r.suggested),
    sold: Number(r.sold),
    reason: String(r.reason ?? ""),
  };
}

function rowToUser(r: Row): User {
  return {
    id: String(r.id),
    name: String(r.name ?? ""),
    phone: String(r.phone ?? ""),
    email: String(r.email ?? ""),
    address: String(r.address ?? ""),
    bio: String(r.bio ?? ""),
    photo: String(r.photo ?? ""),
  };
}

// Per-item sales forecasts seeded on first run (keyed by item id).
// `sold` is derived as `suggested - 2` to reflect a realistic sell-through.
const FORECAST_SEED: Record<string, { suggested: number; sold: number; reason: string }> = {
  "item-1": { suggested: 40, sold: 38, reason: "12 regulars + rainy Saturday + last 3 weeks avg 36" },
  "item-2": { suggested: 8, sold: 6, reason: "cherry season peak + 3 preorders already in" },
  "item-3": { suggested: 24, sold: 22, reason: "shelf-stable, steady — last 4 weeks avg 22" },
  "item-4": { suggested: 15, sold: 13, reason: "slow mover, 15 covers two weeks" },
  "item-5": { suggested: 30, sold: 28, reason: "weekend spike + 2 repeat buyers" },
  "item-6": { suggested: 18, sold: 16, reason: "steady weekday breakfast orders" },
};

// --- Schema + seeding ------------------------------------------------------

export async function initDb(): Promise<void> {
  await sql`CREATE TABLE IF NOT EXISTS makers (
    id text PRIMARY KEY,
    name text NOT NULL,
    bio text NOT NULL DEFAULT '',
    location text NOT NULL DEFAULT '',
    photo text NOT NULL DEFAULT '',
    rating double precision NOT NULL DEFAULT 0
  )`;

  await sql`CREATE TABLE IF NOT EXISTS items (
    seq bigserial,
    id text PRIMARY KEY,
    name text NOT NULL,
    maker text NOT NULL DEFAULT '',
    maker_id text NOT NULL DEFAULT '',
    category text NOT NULL DEFAULT 'other',
    price double precision NOT NULL DEFAULT 0,
    allergens jsonb NOT NULL DEFAULT '[]'::jsonb,
    left_this_week integer NOT NULL DEFAULT 0,
    photo text NOT NULL DEFAULT ''
  )`;

  await sql`CREATE TABLE IF NOT EXISTS meetup_spots (
    id text PRIMARY KEY,
    name text NOT NULL,
    address text NOT NULL DEFAULT '',
    lat double precision NOT NULL DEFAULT 0,
    lng double precision NOT NULL DEFAULT 0,
    notes text NOT NULL DEFAULT ''
  )`;

  await sql`CREATE TABLE IF NOT EXISTS orders (
    seq bigserial,
    id text PRIMARY KEY,
    item_id text NOT NULL,
    item_name text NOT NULL,
    quantity integer NOT NULL,
    unit_price double precision NOT NULL,
    total double precision NOT NULL,
    buyer_name text NOT NULL DEFAULT 'Anonymous',
    meetup_spot_id text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS forecasts (
    item_id text PRIMARY KEY,
    suggested integer NOT NULL DEFAULT 0,
    sold integer NOT NULL DEFAULT 0,
    reason text NOT NULL DEFAULT ''
  )`;

  await sql`CREATE TABLE IF NOT EXISTS users (
    id text PRIMARY KEY,
    name text NOT NULL DEFAULT '',
    phone text NOT NULL DEFAULT '',
    email text NOT NULL DEFAULT '',
    address text NOT NULL DEFAULT '',
    bio text NOT NULL DEFAULT '',
    photo text NOT NULL DEFAULT ''
  )`;

  await seedIfEmpty();
}

async function isEmpty(
  table: "makers" | "items" | "meetup_spots" | "forecasts",
): Promise<boolean> {
  // Table name can't be parameterized; it's a fixed internal literal.
  const rows =
    table === "makers"
      ? await sql`SELECT count(*)::int AS count FROM makers`
      : table === "items"
        ? await sql`SELECT count(*)::int AS count FROM items`
        : table === "meetup_spots"
          ? await sql`SELECT count(*)::int AS count FROM meetup_spots`
          : await sql`SELECT count(*)::int AS count FROM forecasts`;
  return Number((rows[0] as Row).count) === 0;
}

async function seedIfEmpty(): Promise<void> {
  if (await isEmpty("makers")) {
    for (const m of seedMakers) {
      await sql`INSERT INTO makers (id, name, bio, location, photo, rating)
        VALUES (${m.id}, ${m.name}, ${m.bio}, ${m.location}, ${m.photo}, ${m.rating})`;
    }
    console.log(`[db] seeded ${seedMakers.length} makers`);
  }

  if (await isEmpty("items")) {
    for (const it of seedItems) {
      await sql`INSERT INTO items (id, name, maker, maker_id, category, price, allergens, left_this_week, photo)
        VALUES (${it.id}, ${it.name}, ${it.maker}, ${it.makerId}, ${it.category}, ${it.price},
          ${JSON.stringify(it.allergens)}::jsonb, ${it.left_this_week}, ${it.photo})`;
    }
    console.log(`[db] seeded ${seedItems.length} items`);
  }

  if (await isEmpty("meetup_spots")) {
    for (const s of seedSpots) {
      await sql`INSERT INTO meetup_spots (id, name, address, lat, lng, notes)
        VALUES (${s.id}, ${s.name}, ${s.address}, ${s.lat}, ${s.lng}, ${s.notes})`;
    }
    console.log(`[db] seeded ${seedSpots.length} meetup spots`);
  }

  if (await isEmpty("forecasts")) {
    const entries = Object.entries(FORECAST_SEED);
    for (const [itemId, f] of entries) {
      await sql`INSERT INTO forecasts (item_id, suggested, sold, reason)
        VALUES (${itemId}, ${f.suggested}, ${f.sold}, ${f.reason})`;
    }
    console.log(`[db] seeded ${entries.length} forecasts`);
  }

  // Ensure the shared demo user exists (single-user app, no auth).
  await sql`INSERT INTO users (id) VALUES ('me') ON CONFLICT (id) DO NOTHING`;
}

// --- Queries ---------------------------------------------------------------

export async function listItems(): Promise<Item[]> {
  const rows = await sql`SELECT * FROM items ORDER BY seq`;
  return (rows as Row[]).map(rowToItem);
}

export async function listMakers(): Promise<Maker[]> {
  const rows = await sql`SELECT * FROM makers ORDER BY id`;
  return (rows as Row[]).map(rowToMaker);
}

export async function listMeetupSpots(): Promise<MeetupSpot[]> {
  const rows = await sql`SELECT * FROM meetup_spots ORDER BY id`;
  return (rows as Row[]).map(rowToSpot);
}

export async function listOrders(): Promise<Order[]> {
  const rows = await sql`SELECT * FROM orders ORDER BY seq`;
  return (rows as Row[]).map(rowToOrder);
}

export async function getItemById(id: string): Promise<Item | undefined> {
  const rows = await sql`SELECT * FROM items WHERE id = ${id}`;
  const row = (rows as Row[])[0];
  return row ? rowToItem(row) : undefined;
}

export async function spotExists(id: string): Promise<boolean> {
  const rows = await sql`SELECT 1 FROM meetup_spots WHERE id = ${id}`;
  return (rows as Row[]).length > 0;
}

/**
 * Atomically decrements stock only if enough is available.
 * Returns true if the decrement happened, false otherwise.
 */
export async function tryDecrementItem(id: string, qty: number): Promise<boolean> {
  const rows = await sql`UPDATE items
    SET left_this_week = left_this_week - ${qty}
    WHERE id = ${id} AND left_this_week >= ${qty}
    RETURNING id`;
  return (rows as Row[]).length > 0;
}

export async function insertOrder(order: {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  buyerName: string;
  meetupSpotId: string | null;
}): Promise<Order> {
  const rows = await sql`INSERT INTO orders
    (id, item_id, item_name, quantity, unit_price, total, buyer_name, meetup_spot_id)
    VALUES (${order.id}, ${order.itemId}, ${order.itemName}, ${order.quantity},
      ${order.unitPrice}, ${order.total}, ${order.buyerName}, ${order.meetupSpotId})
    RETURNING *`;
  return rowToOrder((rows as Row[])[0]);
}

export async function insertItem(item: Item): Promise<Item> {
  const rows = await sql`INSERT INTO items
    (id, name, maker, maker_id, category, price, allergens, left_this_week, photo)
    VALUES (${item.id}, ${item.name}, ${item.maker}, ${item.makerId}, ${item.category},
      ${item.price}, ${JSON.stringify(item.allergens)}::jsonb, ${item.left_this_week}, ${item.photo})
    RETURNING *`;
  return rowToItem((rows as Row[])[0]);
}

// --- Forecasts -------------------------------------------------------------

export async function getForecast(itemId: string): Promise<Forecast | undefined> {
  const rows = await sql`SELECT * FROM forecasts WHERE item_id = ${itemId}`;
  const row = (rows as Row[])[0];
  return row ? rowToForecast(row) : undefined;
}

/** Inserts (or replaces) the forecast for an item. */
export async function insertForecast(
  itemId: string,
  suggested: number,
  sold: number,
  reason: string,
): Promise<Forecast> {
  const rows = await sql`INSERT INTO forecasts (item_id, suggested, sold, reason)
    VALUES (${itemId}, ${suggested}, ${sold}, ${reason})
    ON CONFLICT (item_id) DO UPDATE SET
      suggested = EXCLUDED.suggested,
      sold = EXCLUDED.sold,
      reason = EXCLUDED.reason
    RETURNING *`;
  return rowToForecast((rows as Row[])[0]);
}

// --- Users -----------------------------------------------------------------

/** Returns the user, creating an empty row first if it doesn't exist. */
export async function getUser(id: string): Promise<User> {
  await sql`INSERT INTO users (id) VALUES (${id}) ON CONFLICT (id) DO NOTHING`;
  const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
  return rowToUser((rows as Row[])[0]);
}

/** Updates only the provided fields (merged over the current row). */
export async function updateUser(id: string, patch: Partial<User>): Promise<User> {
  const current = await getUser(id);
  const next = { ...current, ...patch, id };
  const rows = await sql`UPDATE users SET
    name = ${next.name},
    phone = ${next.phone},
    email = ${next.email},
    address = ${next.address},
    bio = ${next.bio},
    photo = ${next.photo}
    WHERE id = ${id}
    RETURNING *`;
  return rowToUser((rows as Row[])[0]);
}
