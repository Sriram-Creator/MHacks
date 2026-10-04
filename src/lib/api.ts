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

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
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
  const res = await fetch(`${API_URL}/items`, {
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
  const res = await fetch(`${API_URL}/users/${id}`, {
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
  const res = await fetch(`${API_URL}/ai/listing`, {
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
