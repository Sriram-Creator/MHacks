import { API_URL } from '@/constants/config';
import { cottageAgentReply } from '@/lib/cottageAgent';
import {
  forecasts,
  getItem,
  getMaker,
  items,
  makers,
  meetupSpots,
  mockOrders,
} from '@/data/mock';

export type Legality = {
  is_legal: boolean;
  reason: string;
  required_label?: string | null;
  special?: string | null;
};

export type ListingResponse = {
  name: string;
  category: string;
  description: string;
  suggested_price: number;
  ingredients: string[];
  allergens: string[];
  legality: Legality;
  mode: 'mock' | 'live';
};

export type ServerItem = {
  id: string;
  name: string;
  maker: string;
  makerId: string;
  category: string;
  price: number;
  allergens: string[];
  left_this_week: number;
  photo: string;
};

export type ServerForecast = {
  suggested: number;
  sold: number;
  reason: string;
};

export type ServerMeetupSpot = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  notes: string;
};

export type ServerOrder = {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit_price: number;
  total: number;
  buyerName: string;
  meetupSpotId: string | null;
  createdAt: string;
};

export type ServerUser = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  bio: string;
  photo: string;
};

/** Abort any request that takes longer than this so the UI never hangs. */
const REQUEST_TIMEOUT_MS = 8000;

console.log('[api] API_URL =', API_URL);

/**
 * Wraps fetch with a hard timeout (AbortController + Promise.race) and logs
 * every failure — including the full URL — so network problems show up in
 * the device console instead of leaving a spinner spinning forever.
 */
async function request(path: string, init?: RequestInit): Promise<Response> {
  const url = `${API_URL}${path}`;
  const method = init?.method ?? 'GET';
  console.log('[api]', method, url);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const timedOut = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s — ${url}`));
      }, REQUEST_TIMEOUT_MS);
    });
    return await Promise.race([fetch(url, { ...init, signal: controller.signal }), timedOut]);
  } catch (err) {
    const message =
      err instanceof Error && err.name === 'AbortError'
        ? `Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s — ${url}`
        : err instanceof Error
          ? `${err.message} — ${url}`
          : `Network request failed — ${url}`;
    console.warn('[api] could not connect to server', message);
    throw new Error('could not connect to server');
  } finally {
    clearTimeout(timeout);
  }
}

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await request(path);
    if (!res.ok) {
      console.warn('[api] could not connect to server', `${API_URL}${path}`, res.status);
      return fallback;
    }
    return (await res.json()) as T;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'could not connect to server';
    console.warn('[api] could not connect to server', message);
    return fallback;
  }
}

function mockServerItems(): ServerItem[] {
  return items.map((item) => {
    const maker = getMaker(item.maker_id);
    return {
      id: item.id,
      name: item.name,
      maker: maker?.name ?? 'Local maker',
      makerId: item.maker_id,
      category: item.category,
      price: item.price,
      allergens: item.allergens,
      left_this_week: item.left_this_week,
      photo: item.photo,
    };
  });
}

function mockServerUser(id: string): ServerUser {
  const maker = makers[0];
  return {
    id,
    name: '',
    phone: '',
    email: '',
    address: '',
    bio: maker?.bio ?? '',
    photo: maker?.photo ?? '',
  };
}

function mockMeetupSpots(): ServerMeetupSpot[] {
  return meetupSpots.map((spot) => ({
    id: spot.id,
    name: spot.name,
    address: spot.address,
    lat: 42.2808,
    lng: -83.743,
    notes: spot.notes,
  }));
}

function mockServerOrders(): ServerOrder[] {
  return mockOrders.flatMap((order) =>
    order.items.map((line, index) => {
      const item = getItem(line.itemId);
      return {
        id: `${order.id}-${index}`,
        itemId: line.itemId,
        itemName: item?.name ?? 'Item',
        quantity: line.quantity,
        unit_price: item?.price ?? 0,
        total: (item?.price ?? 0) * line.quantity,
        buyerName: 'Jordan M.',
        meetupSpotId: order.spotId,
        createdAt: new Date().toISOString(),
      };
    }),
  );
}

function mockForecast(itemId: string): ServerForecast {
  return (
    forecasts[itemId] ?? {
      suggested: 12,
      sold: 8,
      reason: 'Offline estimate from last week.',
    }
  );
}

export function fetchItems() {
  return getJson<ServerItem[]>('/items', mockServerItems());
}

export type NewItemInput = {
  name: string;
  category: string;
  description?: string;
  price: number;
  ingredients?: string[];
  allergens?: string[];
  left_this_week: number;
  photo?: string;
};

/** Creates a new item on the server and returns the persisted record. */
export async function createItem(input: NewItemInput): Promise<ServerItem> {
  const res = await request('/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(text || `Request failed (${res.status})`);
  }

  if (!res.ok) {
    const message =
      typeof data === 'object' && data && 'error' in data
        ? String((data as { error: unknown }).error)
        : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as ServerItem;
}

export function fetchForecast(itemId: string) {
  return getJson<ServerForecast>(`/forecast/${itemId}`, mockForecast(itemId));
}

/** Same replies as fetch_agent/agent.py. Tries Kod's server; falls back locally (main has no /ai/agent). */
export async function askCottageAgent(question: string): Promise<string> {
  try {
    const res = await fetch(`${API_URL}/ai/agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const text = await res.text();
    const data: unknown = JSON.parse(text);
    if (res.ok && typeof data === 'object' && data && 'answer' in data) {
      return String((data as { answer: unknown }).answer);
    }
  } catch {
    // Venue Wi-Fi or main server without this route — use bundled agent replies.
  }
  return cottageAgentReply(question);
}

export function fetchMeetupSpots() {
  return getJson<ServerMeetupSpot[]>('/meetup-spots', mockMeetupSpots());
}

export function fetchOrders() {
  return getJson<ServerOrder[]>('/orders', mockServerOrders());
}

export function fetchUser(id: string) {
  return getJson<ServerUser>(`/users/${id}`, mockServerUser(id));
}

/** Updates the provided account fields for a user and returns the record. */
export async function updateUser(
  id: string,
  patch: Partial<Omit<ServerUser, 'id'>>,
): Promise<ServerUser> {
  try {
    const res = await request(`/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      console.warn('[api] could not connect to server', text || `Request failed (${res.status})`);
      return { ...mockServerUser(id), ...patch };
    }

    if (!res.ok) {
      const message =
        typeof data === 'object' && data && 'error' in data
          ? String((data as { error: unknown }).error)
          : `Request failed (${res.status})`;
      console.warn('[api] could not connect to server', message);
      return { ...mockServerUser(id), ...patch };
    }

    return data as ServerUser;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'could not connect to server';
    console.warn('[api] could not connect to server', message);
    return { ...mockServerUser(id), ...patch };
  }
}

/**
 * Sends a base64 data-URL image to the AI listing endpoint along with the
 * current state, and returns the generated listing plus its legality result.
 */
export async function generateListing(
  imageDataUrl: string,
  state: string,
  hint?: string,
): Promise<ListingResponse> {
  const res = await request('/ai/listing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageDataUrl, state, hint }),
  });

  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(text || `Request failed (${res.status})`);
  }

  if (!res.ok) {
    const message =
      typeof data === 'object' && data && 'error' in data
        ? String((data as { error: unknown }).error)
        : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as ListingResponse;
}

export const STATE_NAMES: Record<string, string> = {
  MI: 'Michigan',
  WY: 'Wyoming',
};
