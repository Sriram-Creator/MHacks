import { API_URL } from '@/constants/config';

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
    console.log('[api] request failed:', message);
    console.error('[api] request failed:', err);
    throw new Error(message);
  } finally {
    clearTimeout(timeout);
  }
}

async function getJson<T>(path: string): Promise<T> {
  const res = await request(path);
  if (!res.ok) {
    const message = `Request failed (${res.status}) — ${API_URL}${path}`;
    console.error('[api]', message);
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export function fetchItems() {
  return getJson<ServerItem[]>('/items');
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
  return getJson<ServerForecast>(`/forecast/${itemId}`);
}

export function fetchMeetupSpots() {
  return getJson<ServerMeetupSpot[]>('/meetup-spots');
}

export function fetchOrders() {
  return getJson<ServerOrder[]>('/orders');
}

export function fetchUser(id: string) {
  return getJson<ServerUser>(`/users/${id}`);
}

/** Updates the provided account fields for a user and returns the record. */
export async function updateUser(
  id: string,
  patch: Partial<Omit<ServerUser, 'id'>>,
): Promise<ServerUser> {
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
    throw new Error(text || `Request failed (${res.status})`);
  }

  if (!res.ok) {
    const message =
      typeof data === 'object' && data && 'error' in data
        ? String((data as { error: unknown }).error)
        : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as ServerUser;
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
