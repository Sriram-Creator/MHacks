# Savor

![tag:innovationlab](https://img.shields.io/badge/innovationlab-3D8BD3)
![tag:hackathon](https://img.shields.io/badge/hackathon-5F43F1)

**Savor** is a local cottage-food marketplace for Michigan, built at MHacks 2026. Buyers build a box from nearby makers and pick up at a public meetup. Makers list items, see whether they are legal to sell, and get a weekly “how many to bake” number. The same marketplace is also a Fetch.ai agent you can use inside ASI:One chat, with no custom frontend.

- **App:** Expo / React Native (`src/app/`)
- **API:** Express + TypeScript in `server/` on port **3001**
- **Agent:** Agentverse-hosted `fetch_agent/agent.py`

Repo: https://github.com/Sriram-Creator/MHacks

## The problem

Home bakers and jam makers still sell on Instagram DMs and Venmo. Buyers cannot search by allergen or distance. Makers guess how much to bake and often do not know Michigan cottage-food rules. Michigan also requires that a customer can talk to the maker before buying.

Savor is two doors into one marketplace: an app for browsing, and an agent for doing it in one sentence.

## What it does

### Buyer (Expo)

- Home feed: Ann Arbor, search, radius chips, categories, makers, item cards with stock left this week
- Item page: photo, price, allergens, made-on date, ingredients, home-kitchen disclaimer, Add to Box
- Maker profile: bio, cottage-food badge, Chat / Call / Email, this week’s items
- Box + checkout: quantities, one-time or weekly, meetup spot, Saturday pickup window
- Orders with status pills
- Messages thread with a Michigan contact-the-maker banner

### Maker (Expo)

- List / publish items (photo-first)
- Legal banner (allowed vs not, e.g. pickles in Michigan)
- Capacity: “List 40” forecast vs sold after cutoff
- Prep sheet / orders

### Server

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | liveness |
| GET | `/items` | catalog |
| GET | `/makers` | makers |
| GET | `/meetup-spots` | pickup spots |
| GET | `/orders` | orders |
| POST | `/orders` | place order `{ itemId, quantity, meetupSpotId, buyerName }` |
| GET | `/forecast/:itemId` | suggested vs sold + reason |
| POST | `/ai/listing` | photo → listing draft + legality (NVIDIA NIM, or mock) |

Item fields: `id`, `name`, `maker`, `makerId`, `category`, `price`, `allergens[]`, `left_this_week`, `photo`.  
Spot fields: `id`, `name`, `address`, `lat`, `lng`, `notes`.  
Cottage rules: `server/rules/MI.json`, `server/rules/WY.json`.

## Fetch.ai agent (ASI:One Challenge)

This is the **only** agent to use for judging, Devpost, and the ASI:One Submission Agent. Do not use `@cottage-ai`.

| | |
|---|---|
| **Name** | michigan-cottage-compliance |
| **Handle** | `@michigan-cottage-com` |
| **Address** | `agent1qfp4fke569p8elfchcezp2asr9zq9vvwcpq89d5nn7yfzatnag3kj3kw5c2` |
| **Profile** | https://agentverse.ai/agents/details/agent1qfp4fke569p8elfchcezp2asr9zq9vvwcpq89d5nn7yfzatnag3kj3kw5c2/profile |
| **Code** | [`fetch_agent/agent.py`](fetch_agent/agent.py) (same as Agentverse editor) |
| **Protocol** | Chat Protocol (`AgentChatProtocol`) |

### How to test in ASI:One

Tag `@michigan-cottage-com` and send, in order:

1. `hi` — warmup (cold start often drops the first message)
2. `Can I sell pickles in Michigan?` — **NO** (cottage rules / botulism risk)
3. `How much sourdough should I make?` — **List 40:** …
4. `nut-free breakfast box under $30` — sourdough + jam + honey for **$27**, Farmers Market pickup, mock `ORD-xxxxxx` IDs

### Honest limits (prototype)

The hosted agent uses a **hardcoded snapshot** of items, prices, allergens, stock, and pickup spots. Stock does not decrease. Order IDs are random. Nothing is POSTed to Kod’s server. The forecast is a fixed message; the legal check is a keyword list.

Kod’s API on hackathon Wi‑Fi (`http://…:3001`) is not reachable from Agentverse. Next step is a Cloudflare tunnel to live `/items`, `/meetup-spots`, `POST /orders`, and `/forecast/:itemId`, with snapshot fallback.

Do not restart or edit the hosted agent before judging. Do not rotate the agent seed until after judging (it changes the address).

## Run locally

### App

```bash
npm install
npx expo start
```

Open in Expo Go, an iOS simulator, or Android emulator. Set `API_URL` in `src/constants/config.ts` to the server (use `http://…` for a raw IP, not `https://`).

### Server

```bash
cd server
npm install
cp .env.example .env   # DATABASE_URL, optional NVIDIA_API_KEY
npm run dev
```

Runs on **http://localhost:3001**. Postgres is Neon. Without `NVIDIA_API_KEY` (or with `MOCK_AI=true`), listing generation is mock; legality still runs.

### Agent (local, optional)

The live demo is the Agentverse-hosted agent. `savoragent.py` and `hearth_agent.py` are earlier local sketches; do not submit those addresses.

In ASI:One chat, tag `@michigan-cottage-com` and send:

1. `Can I sell pickles in Michigan?` — legal check (NO)
2. `How much sourdough should I make?` — forecast (`List 40: ...`)
3. `nut-free breakfast box under $30` — mock box order (sourdough, jam, honey, pickup, `ORD-xxxxxx`)

The catalog, prices, allergens, stock, and pickup spots are a hardcoded snapshot. Stock does not decrease, order IDs are random, and nothing is sent to the Savor server. The forecast is a fixed message; the legal check is a keyword list.

If the first message has no reply, send a throwaway warmup message first (cold start). Do not restart or edit the hosted agent before judging.

## Built with

Expo, Expo Router, React Native, React, TypeScript, NativeWind / Tailwind CSS, Node.js, Express, Neon Postgres, NVIDIA NIM (vision listings), Python, Fetch.ai uAgents, Agentverse, ASI:One, Figma, Notability, GitHub.

## Team notes for judges

Savor has an app for browsing and an agent for doing it by chat. Makers can ask what is legal and how much to bake. Buyers can say “nut-free box under $30” and the agent builds the order. Current state is a prototype: snapshot catalog and mock order IDs on the hosted agent. Do not claim real-time stock or live orders.

## Fetch.ai Agent (ASI:One Challenge)

![tag:innovationlab](https://img.shields.io/badge/innovationlab-3D8BD3)
![tag:hackathon](https://img.shields.io/badge/hackathon-5F43F1)

Hosted agent code: [`fetch_agent/agent.py`](fetch_agent/agent.py) (Agentverse editor).

- **Agent name:** michigan-cottage-compliance
- **Handle:** `@michigan-cottage-com`
- **Address:** `agent1qfp4fke569p8elfchcezp2asr9zq9vvwcpq89d5nn7yfzatnag3kj3kw5c2`
- **Profile:** https://agentverse.ai/agents/details/agent1qfp4fke569p8elfchcezp2asr9zq9vvwcpq89d5nn7yfzatnag3kj3kw5c2/profile


