# Savor

![tag:innovationlab](https://img.shields.io/badge/innovationlab-3D8BD3)
![tag:hackathon](https://img.shields.io/badge/hackathon-5F43F1)

**Savor** is a local cottage-food marketplace for Michigan, built at MHacks 2026. Buyers build a box from nearby makers and pick up at a public meetup. Makers list items, see whether they are legal to sell, and get a weekly “how many to bake” forecast. The same marketplace is also accessible as a Fetch.ai agent inside ASI:One chat, with no custom frontend required.

- **App:** Expo / React Native (`src/app/`)
- **API:** Express + TypeScript in `server/` on port **3001**
- **Agent:** Agentverse-hosted `fetch_agent/agent.py`

**Repo:** https://github.com/Sriram-Creator/MHacks

---

## The Problem

Home bakers and jam makers still sell primarily through Instagram DMs and Venmo. Buyers cannot easily search by allergen or geographic distance. Makers guess how much to bake—often throwing away unsold goods—and frequently struggle to navigate complex Michigan cottage-food regulations. Michigan law also requires a direct line of communication between customer and maker prior to purchase.

Savor provides **two doors into one marketplace**: an app for browsing and an AI agent for completing tasks in a single sentence.

---

## What It Does

### Buyer (Expo App)
- **Home feed:** Radius slider (Ann Arbor), search, category chips, maker profiles, and item cards displaying remaining weekly stock.
- **Item details:** Photo, pricing, allergen warnings, made-on date, ingredients, state-required home-kitchen disclaimers, and "Add to Box".
- **Maker profile:** Bio, official cottage-food badge, direct contact options (Chat / Call / Email), and active weekly inventory.
- **Box & Checkout:** Quantity selection, one-time or subscription weekly orders, public meetup spot selection, and Saturday pickup time windows.
- **Orders:** Order tracking with dynamic status badges.
- **Messaging:** Direct chat thread featuring a state-mandated contact-the-maker banner.

### Maker (Expo App)
- **Listing management:** Photo-first item publishing flow.
- **Legal compliance banner:** Real-time feedback on allowed vs. prohibited foods under cottage laws (e.g., acidified foods like pickles fail in Michigan).
- **Capacity planner:** AI/heuristic demand forecasting (e.g., "List 40") versus actual sales post-cutoff.
- **Prep sheets:** Automated fulfillment lists and order aggregation.

---

## Server & API Architecture

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/health` | Server liveness check |
| `GET` | `/items` | Retrieve active catalog items |
| `GET` | `/makers` | Retrieve list of registered makers |
| `GET` | `/meetup-spots` | Retrieve public pickup locations |
| `GET` | `/orders` | Retrieve order history |
| `POST` | `/orders` | Place order `{ itemId, quantity, meetupSpotId, buyerName }` |
| `GET` | `/forecast/:itemId` | Suggested batch size vs. sold history with reasoning |
| `POST` | `/ai/listing` | Vision model (NVIDIA NIM or mock): Photo → Draft listing + legality check |

- **Item schema:** `id`, `name`, `maker`, `makerId`, `category`, `price`, `allergens[]`, `left_this_week`, `photo`.
- **Pickup spot schema:** `id`, `name`, `address`, `lat`, `lng`, `notes`.
- **Cottage rules engine:** Configured via rule files (`server/rules/MI.json`, `server/rules/WY.json`).

---

## Fetch.ai Agent (ASI:One Challenge)

This is the **only** agent to use for judging, Devpost, and the ASI:One Submission Agent. Do not use `@cottage-ai`.

| Attribute | Details |
|---|---|
| **Name** | `michigan-cottage-compliance` |
| **Handle** | `@michigan-cottage-com` |
| **Address** | `agent1qfp4fke569p8elfchcezp2asr9zq9vvwcpq89d5nn7yfzatnag3kj3kw5c2` |
| **Profile** | [Agentverse Profile](https://agentverse.ai/agents/details/agent1qfp4fke569p8elfchcezp2asr9zq9vvwcpq89d5nn7yfzatnag3kj3kw5c2/profile) |
| **Code** | [`fetch_agent/agent.py`](fetch_agent/agent.py) |
| **Protocol** | Chat Protocol (`AgentChatProtocol`) |

### How to Test in ASI:One

Tag `@michigan-cottage-com` and send the following queries in order:

1. `hi` — Warmup message (cold start on Agentverse may drop the initial message).
2. `Can I sell pickles in Michigan?` — Legal check response (**NO**: high-risk acidified food/botulism restriction).
3. `How much sourdough should I make?` — Forecast response (**List 40:** based on historical demand).
4. `nut-free breakfast box under $30` — Packs a custom order (sourdough + jam + honey = **$27**), assigns a Farmers Market pickup, and generates mock `ORD-xxxxxx` confirmation IDs.

### Prototype Limits & Current Scope

* The hosted agent currently uses a **hardcoded snapshot** of items, prices, allergens, stock, and pickup spots. Stock count does not decrement and order IDs are generated pseudo-randomly.
* External webhook calls from Agentverse to the local API server on venue Wi-Fi (`http://...:3001`) are currently restricted. Production deployment will utilize a Cloudflare Tunnel to connect directly to live API endpoints (`/items`, `/meetup-spots`, `POST /orders`, `/forecast`).
* *Note for Judges:* Do not restart or edit the hosted agent configuration during judging to maintain active address routing.

---

## Run Locally

### Prerequisites
* Node.js (v18+)
* Expo Go app (iOS/Android) or simulator

### 1. Mobile App
```bash
npm install
npx expo start
