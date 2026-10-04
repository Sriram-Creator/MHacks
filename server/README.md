# MHacks Server

Standalone Express + TypeScript API (separate from the Expo app). Runs on **port 3001**.

## Setup

```bash
cd server
npm install
cp .env.example .env   # then add your NVIDIA_API_KEY and DATABASE_URL
npm run dev
```

## Database

Data is stored in **Neon Postgres** (set `DATABASE_URL` in `.env`). On startup the
server creates the `makers`, `items`, `meetup_spots`, and `orders` tables if they
don't exist and seeds them from the mock data only when they're empty. `GET`/`POST`
for items, makers, meetup-spots, and orders all read/write the database.

## Scripts

- `npm run dev` — start with hot reload (tsx)
- `npm run build` — compile to `dist/`
- `npm start` — run compiled server
- `npm run typecheck` — type-check only

## Endpoints

### `POST /ai/listing`

Body:

```json
{ "image": "<base64 or data URL>", "state": "MI", "hint": "jam" }
```

Sends the image to NVIDIA NIM's OpenAI-compatible vision API
(`https://integrate.api.nvidia.com/v1/chat/completions`), then runs a
cottage-food rules check for the given state.

**Mock mode:** if `NVIDIA_API_KEY` is missing or `MOCK_AI=true`, the LLM call is
skipped and a realistic hardcoded listing is returned based on `hint`
(e.g. `"jam"` → Strawberry Jam, `"pickles"` → Dill Pickles). In mock mode
`image` is optional. The legality check always runs on the result, and the
active mode is logged and returned as `"mode"`. Response:

```json
{
  "name": "Chocolate Chip Cookies",
  "category": "baked goods",
  "description": "...",
  "suggested_price": 12,
  "ingredients": ["flour", "butter", "sugar", "chocolate"],
  "allergens": ["wheat", "dairy", "eggs"],
  "legality": {
    "is_legal": true,
    "reason": "Allowed under Michigan cottage-food law (matches \"cookies\"). Label required: \"...\".",
    "required_label": "...",
    "special": "Buyer must be able to contact the maker before sale"
  },
  "mode": "live"
}
```

### `GET /forecast/:itemId`

Returns mock sales forecast data:

```json
{ "suggested": 40, "sold": 38, "reason": "12 regulars + rainy Saturday + last 3 weeks avg 36" }
```

### `GET /items`

Returns all marketplace items: `{ id, name, maker, makerId, category, price, allergens[], left_this_week, photo }`.

### `GET /makers`

Returns all makers: `{ id, name, bio, location, photo, rating }`.

### `GET /meetup-spots`

Returns 4 public Ann Arbor meetup spots: `{ id, name, address, lat, lng, notes }`.

### `GET /orders`

Returns all placed orders (in-memory; resets on restart).

### `POST /orders`

Body:

```json
{ "itemId": "item-2", "quantity": 2, "buyerName": "Alex", "meetupSpotId": "spot-1" }
```

`quantity` defaults to `1`; `buyerName` and `meetupSpotId` are optional. On
success it decrements the item's `left_this_week` and returns the created order:

```json
{
  "id": "89a1ca22-...",
  "itemId": "item-2",
  "itemName": "Michigan Cherry Pie",
  "quantity": 2,
  "unit_price": 22,
  "total": 44,
  "buyerName": "Alex",
  "meetupSpotId": "spot-1",
  "createdAt": "2026-10-03T22:16:18.088Z"
}
```

Errors: `400` (missing `itemId` / bad `quantity` / unknown `meetupSpotId`),
`404` (unknown item), `409` (not enough stock left this week).

### `GET /health`

Returns `{ "ok": true }`.

## Rules

Per-state cottage-food rules live in `rules/<STATE>.json` (currently `MI` and `WY`).
