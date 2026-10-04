export interface Listing {
  name: string;
  category: string;
  description: string;
  suggested_price: number;
  ingredients: string[];
  allergens: string[];
}

export interface LegalityResult {
  is_legal: boolean;
  reason: string;
  required_label?: string | null;
  special?: string | null;
}

export interface StateRules {
  state: string;
  name: string;
  allowed: string[];
  blocked: string[];
  required_label: string | null;
  special: string | null;
}

export interface Forecast {
  suggested: number;
  sold: number;
  reason: string;
}

export interface Item {
  id: string;
  name: string;
  maker: string;
  makerId: string;
  category: string;
  price: number;
  allergens: string[];
  left_this_week: number;
  photo: string;
}

export interface Maker {
  id: string;
  name: string;
  bio: string;
  location: string;
  photo: string;
  rating: number;
}

export interface MeetupSpot {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  notes: string;
}

export interface Order {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit_price: number;
  total: number;
  buyerName: string;
  meetupSpotId: string | null;
  createdAt: string;
}
