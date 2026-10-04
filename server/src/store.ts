import type { Item, Maker, MeetupSpot, Order } from "./types.js";

/**
 * In-memory data store for the demo. Items are mutable (left_this_week is
 * decremented when orders are placed) and orders accumulate in a plain array.
 * Everything resets when the server restarts.
 */

export const makers: Maker[] = [
  {
    id: "maker-1",
    name: "Nadia's Kitchen",
    bio: "Home baker specializing in sourdough and seasonal fruit pies.",
    location: "Burns Park, Ann Arbor",
    photo: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400",
    rating: 4.9,
  },
  {
    id: "maker-2",
    name: "The Jam Shed",
    bio: "Small-batch jams, jellies, and preserves from Michigan fruit.",
    location: "Kerrytown, Ann Arbor",
    photo: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=400",
    rating: 4.8,
  },
  {
    id: "maker-3",
    name: "Oakwood Honey Co.",
    bio: "Backyard beekeeper offering raw wildflower honey and beeswax goods.",
    location: "Old West Side, Ann Arbor",
    photo: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
    rating: 5.0,
  },
  {
    id: "maker-4",
    name: "Maize & Blue Bakes",
    bio: "Cookies, granola, and dry baking mixes made to order.",
    location: "Kerrytown, Ann Arbor",
    photo: "https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=400",
    rating: 4.7,
  },
];

export const items: Item[] = [
  {
    id: "item-1",
    name: "Classic Sourdough Loaf",
    maker: "Nadia's Kitchen",
    makerId: "maker-1",
    category: "bread",
    price: 9,
    allergens: ["wheat"],
    left_this_week: 12,
    photo: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=600",
  },
  {
    id: "item-2",
    name: "Michigan Cherry Pie",
    maker: "Nadia's Kitchen",
    makerId: "maker-1",
    category: "fruit pies",
    price: 22,
    allergens: ["wheat", "dairy"],
    left_this_week: 5,
    photo: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=600",
  },
  {
    id: "item-3",
    name: "Strawberry Jam",
    maker: "The Jam Shed",
    makerId: "maker-2",
    category: "jam",
    price: 8,
    allergens: [],
    left_this_week: 20,
    photo: "https://images.unsplash.com/photo-1560180474-e8563fd75bab?w=600",
  },
  {
    id: "item-4",
    name: "Wildflower Honey",
    maker: "Oakwood Honey Co.",
    makerId: "maker-3",
    category: "honey",
    price: 10,
    allergens: [],
    left_this_week: 15,
    photo: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600",
  },
  {
    id: "item-5",
    name: "Chocolate Chip Cookies (6-pack)",
    maker: "Maize & Blue Bakes",
    makerId: "maker-4",
    category: "baked goods",
    price: 12,
    allergens: ["wheat", "dairy", "eggs"],
    left_this_week: 30,
    photo: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600",
  },
  {
    id: "item-6",
    name: "Maple Almond Granola",
    maker: "Maize & Blue Bakes",
    makerId: "maker-4",
    category: "granola",
    price: 11,
    allergens: ["nuts"],
    left_this_week: 18,
    photo: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=600",
  },
];

export const meetupSpots: MeetupSpot[] = [
  {
    id: "spot-1",
    name: "Ann Arbor Farmers Market",
    address: "315 Detroit St, Ann Arbor, MI 48104",
    lat: 42.2847,
    lng: -83.7447,
    notes: "Busy Kerrytown market; easy, public handoff on market days.",
  },
  {
    id: "spot-2",
    name: "Ann Arbor District Library — Downtown",
    address: "343 S Fifth Ave, Ann Arbor, MI 48104",
    lat: 42.2793,
    lng: -83.7434,
    notes: "Well-lit public lobby with seating near the entrance.",
  },
  {
    id: "spot-3",
    name: "Nichols Arboretum",
    address: "1610 Washington Heights, Ann Arbor, MI 48104",
    lat: 42.2793,
    lng: -83.7256,
    notes: "Meet at the main Washington Heights entrance.",
  },
  {
    id: "spot-4",
    name: "University of Michigan Diag",
    address: "913 S University Ave, Ann Arbor, MI 48109",
    lat: 42.2769,
    lng: -83.7382,
    notes: "Central campus landmark; high-traffic and easy to find.",
  },
];

export const orders: Order[] = [];

export function findItem(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}

export function findSpot(id: string): MeetupSpot | undefined {
  return meetupSpots.find((s) => s.id === id);
}
