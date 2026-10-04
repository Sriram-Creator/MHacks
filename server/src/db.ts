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

/**
 * Forecast model inputs per item. `weeks` is the synthetic order-quantity
 * history seeded into `order_history` (most recent week first). `seasonality`
 * is the multiplier applied to the 3-week average, with a short label that
 * explains it. Forecasts are computed from these inputs, not hardcoded.
 */
const FORECAST_MODEL: Record<
  string,
  { weeks: [number, number, number]; seasonality: number; label: string }
> = {
  "item-1": { weeks: [39, 36, 34], seasonality: 1.1, label: "rainy Saturday" },
  "item-2": { weeks: [6, 5, 4], seasonality: 1.6, label: "cherry season peak" },
  "item-3": { weeks: [26, 24, 22], seasonality: 1.0, label: "steady, shelf-stable" },
  "item-4": { weeks: [16, 15, 14], seasonality: 1.0, label: "slow mover" },
  "item-5": { weeks: [26, 25, 24], seasonality: 1.2, label: "weekend spike" },
  "item-6": { weeks: [19, 18, 17], seasonality: 1.0, label: "steady weekday breakfast" },
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

  // Forecasts are now computed from order_history, so drop the old
  // hardcoded forecasts table if it exists.
  await sql`DROP TABLE IF EXISTS forecasts`;

  // Synthetic weekly order-quantity history used to compute forecasts.
  // weeks_ago: 1 = most recent completed week, 3 = oldest.
  await sql`CREATE TABLE IF NOT EXISTS order_history (
    item_id text NOT NULL,
    weeks_ago integer NOT NULL,
    quantity integer NOT NULL,
    PRIMARY KEY (item_id, weeks_ago)
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
  table: "makers" | "items" | "meetup_spots" | "order_history",
): Promise<boolean> {
  // Table name can't be parameterized; it's a fixed internal literal.
  const rows =
    table === "makers"
      ? await sql`SELECT count(*)::int AS count FROM makers`
      : table === "items"
        ? await sql`SELECT count(*)::int AS count FROM items`
        : table === "meetup_spots"
          ? await sql`SELECT count(*)::int AS count FROM meetup_spots`
          : await sql`SELECT count(*)::int AS count FROM order_history`;
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

  if (await isEmpty("order_history")) {
    const entries = Object.entries(FORECAST_MODEL);
    let weekRows = 0;
    for (const [itemId, model] of entries) {
      // weeks[0] is the most recent week (weeks_ago = 1).
      for (let i = 0; i < model.weeks.length; i++) {
        await sql`INSERT INTO order_history (item_id, weeks_ago, quantity)
          VALUES (${itemId}, ${i + 1}, ${model.weeks[i]})`;
        weekRows++;
      }
    }
    console.log(
      `[db] seeded ${weekRows} order-history rows across ${entries.length} items`,
    );
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

// --- Forecasts (computed from order history) --------------------------------

/** Returns weekly order quantities for an item, ordered newest week first. */
export async function getOrderHistory(
  itemId: string,
): Promise<{ weeksAgo: number; quantity: number }[]> {
  const rows = await sql`SELECT weeks_ago, quantity FROM order_history
    WHERE item_id = ${itemId}
    ORDER BY weeks_ago ASC`;
  return (rows as Row[]).map((r) => ({
    weeksAgo: Number(r.weeks_ago),
    quantity: Number(r.quantity),
  }));
}

/**
 * Computes a forecast from the last 3 weeks of order history:
 *   suggested = round(avg(last 3 weeks) * seasonality)
 * The `reason` string spells out the exact inputs used. Returns undefined
 * when there's no history for the item (e.g. a brand-new listing).
 */
export async function computeForecast(itemId: string): Promise<Forecast | undefined> {
  const history = await getOrderHistory(itemId);
  if (history.length === 0) {
    return undefined;
  }

  // Use up to the last 3 weeks of data.
  const recent = history.slice(0, 3);
  const quantities = recent.map((h) => h.quantity);
  const avg = quantities.reduce((sum, q) => sum + q, 0) / quantities.length;

  const model = FORECAST_MODEL[itemId];
  const seasonality = model?.seasonality ?? 1;
  const label = model?.label ?? "seasonal demand";

  const suggested = Math.round(avg * seasonality);
  // Most recent completed week's actual sales.
  const sold = recent[0]?.quantity ?? 0;

  // Chronological order (oldest -> newest) reads naturally in the reason.
  const chronological = [...quantities].reverse().join(", ");
  const avgDisplay = Math.round(avg);
  const reason =
    `last 3 weeks ${chronological} → avg ${avgDisplay} ` +
    `×${seasonality.toFixed(1)} ${label} = ${suggested}`;

  return { suggested, sold, reason };
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
