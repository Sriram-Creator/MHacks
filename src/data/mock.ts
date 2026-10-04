export type Maker = {
  id: string;
  name: string;
  bio: string;
  photo: string;
  distance: number;
  badge: 'Cottage food operator – MI';
};

export type ItemCategory = 'bread' | 'jam' | 'granola' | 'honey' | 'cookies';

export type Item = {
  id: string;
  name: string;
  maker_id: string;
  category: ItemCategory;
  price: number;
  ingredients: string;
  allergens: string[];
  made_on: string;
  shelf_life: string;
  left_this_week: number;
  photo: string;
};

export type MeetupSpot = {
  id: string;
  name: string;
  kind: 'library' | 'police-safe-exchange' | 'cafe' | 'farmers-market';
  address: string;
  notes: string;
};

export type Forecast = {
  suggested: number;
  sold: number;
  reason: string;
};

export const makers: Maker[] = [
  {
    id: 'maker-maple-rye',
    name: 'Maple & Rye Bakery',
    bio: 'Sourdough and sandwich loaves from a Burns Park kitchen. Wild yeast, Michigan maple, and a Friday bake list that sells out by noon.',
    photo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    distance: 1.2,
    badge: 'Cottage food operator – MI',
  },
  {
    id: 'maker-kerrytown-jam',
    name: 'Kerrytown Jam Co.',
    bio: 'Small-batch fruit preserves from U-Pick berries and orchard seconds. Low-sugar pots you can taste through the glass.',
    photo: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&q=80',
    distance: 0.8,
    badge: 'Cottage food operator – MI',
  },
  {
    id: 'maker-burns-granola',
    name: 'Burns Park Granola',
    bio: 'Toasted oats, local honey, and whatever nuts we roasted that week. Crunchy clusters packed in compostable bags.',
    photo: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=80',
    distance: 1.6,
    badge: 'Cottage food operator – MI',
  },
  {
    id: 'maker-honeycomb-hills',
    name: 'Honeycomb Hills',
    bio: 'Raw honey from hives west of Dexter. We bottle by bloom — spring locust, summer basswood, and a dark fall wildflower.',
    photo: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80',
    distance: 8.4,
    badge: 'Cottage food operator – MI',
  },
  {
    id: 'maker-night-oven',
    name: 'Night Oven Cookies',
    bio: 'Late-night cookie trays from a Water Hill bungalow. Thick, salty-sweet, and packed two-by-two for meetup night.',
    photo: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80',
    distance: 2.1,
    badge: 'Cottage food operator – MI',
  },
  {
    id: 'maker-washtenaw-wildflower',
    name: 'Washtenaw Wildflower',
    bio: 'Floral shortbread, honey butter cookies, and jam thumbprints. A cottage pantry that leans on whatever is in season.',
    photo: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&q=80',
    distance: 3.4,
    badge: 'Cottage food operator – MI',
  },
];

export const items: Item[] = [
  {
    id: 'item-country-sourdough',
    name: 'Country Sourdough Boule',
    maker_id: 'maker-maple-rye',
    category: 'bread',
    price: 9,
    ingredients: 'Bread flour, whole wheat flour, water, sea salt, wild starter',
    allergens: ['wheat'],
    made_on: '2026-10-02',
    shelf_life: '4 days',
    left_this_week: 6,
    photo: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&q=80',
  },
  {
    id: 'item-maple-sandwich-loaf',
    name: 'Maple Sandwich Loaf',
    maker_id: 'maker-maple-rye',
    category: 'bread',
    price: 8,
    ingredients: 'Bread flour, milk, butter, eggs, Michigan maple syrup, yeast, salt',
    allergens: ['wheat', 'milk', 'eggs'],
    made_on: '2026-10-02',
    shelf_life: '5 days',
    left_this_week: 4,
    photo: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=800&q=80',
  },
  {
    id: 'item-seeded-rye',
    name: 'Seeded Rye Batard',
    maker_id: 'maker-maple-rye',
    category: 'bread',
    price: 10,
    ingredients: 'Rye flour, bread flour, water, caraway, sunflower seeds, salt, starter',
    allergens: ['wheat'],
    made_on: '2026-10-01',
    shelf_life: '5 days',
    left_this_week: 3,
    photo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
  },
  {
    id: 'item-cinnamon-swirl',
    name: 'Cinnamon Swirl Pull-Apart',
    maker_id: 'maker-maple-rye',
    category: 'bread',
    price: 12,
    ingredients: 'Bread flour, butter, milk, eggs, cinnamon, brown sugar, salt, yeast',
    allergens: ['wheat', 'milk', 'eggs'],
    made_on: '2026-10-03',
    shelf_life: '3 days',
    left_this_week: 2,
    photo: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=800&q=80',
  },
  {
    id: 'item-strawberry-rhubarb',
    name: 'Strawberry Rhubarb Jam',
    maker_id: 'maker-kerrytown-jam',
    category: 'jam',
    price: 11,
    ingredients: 'Strawberries, rhubarb, cane sugar, lemon juice, pectin',
    allergens: [],
    made_on: '2026-09-28',
    shelf_life: '3 months sealed',
    left_this_week: 9,
    photo: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&q=80',
  },
  {
    id: 'item-peach-vanilla',
    name: 'Peach Vanilla Bean Jam',
    maker_id: 'maker-kerrytown-jam',
    category: 'jam',
    price: 12,
    ingredients: 'Michigan peaches, cane sugar, vanilla bean, lemon juice, pectin',
    allergens: [],
    made_on: '2026-09-20',
    shelf_life: '3 months sealed',
    left_this_week: 5,
    photo: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80',
  },
  {
    id: 'item-blackberry-sage',
    name: 'Blackberry Sage Jam',
    maker_id: 'maker-kerrytown-jam',
    category: 'jam',
    price: 12,
    ingredients: 'Blackberries, cane sugar, fresh sage, lemon juice, pectin',
    allergens: [],
    made_on: '2026-09-22',
    shelf_life: '3 months sealed',
    left_this_week: 7,
    photo: 'https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=800&q=80',
  },
  {
    id: 'item-sour-cherry',
    name: 'Sour Cherry Conserve',
    maker_id: 'maker-kerrytown-jam',
    category: 'jam',
    price: 13,
    ingredients: 'Montmorency cherries, cane sugar, lemon zest, pectin',
    allergens: [],
    made_on: '2026-07-18',
    shelf_life: '6 months sealed',
    left_this_week: 4,
    photo: 'https://images.unsplash.com/photo-1464455266611-42d3c1d6b7d5?w=800&q=80',
  },
  {
    id: 'item-classic-cluster',
    name: 'Classic Honey Cluster Granola',
    maker_id: 'maker-burns-granola',
    category: 'granola',
    price: 10,
    ingredients: 'Rolled oats, local honey, olive oil, almonds, pumpkin seeds, salt, cinnamon',
    allergens: ['tree nuts'],
    made_on: '2026-10-01',
    shelf_life: '3 weeks',
    left_this_week: 11,
    photo: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=80',
  },
  {
    id: 'item-maple-pecan-granola',
    name: 'Maple Pecan Granola',
    maker_id: 'maker-burns-granola',
    category: 'granola',
    price: 11,
    ingredients: 'Rolled oats, maple syrup, pecans, coconut oil, brown sugar, salt',
    allergens: ['tree nuts'],
    made_on: '2026-09-30',
    shelf_life: '3 weeks',
    left_this_week: 8,
    photo: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=800&q=80',
  },
  {
    id: 'item-cacao-cherry-granola',
    name: 'Cacao Cherry Granola',
    maker_id: 'maker-burns-granola',
    category: 'granola',
    price: 12,
    ingredients: 'Rolled oats, honey, cacao nibs, dried cherries, sunflower seeds, coconut oil, salt',
    allergens: [],
    made_on: '2026-10-02',
    shelf_life: '3 weeks',
    left_this_week: 6,
    photo: 'https://images.unsplash.com/photo-1488477181946-6428a0491777?w=800&q=80',
  },
  {
    id: 'item-spring-locust',
    name: 'Spring Locust Honey',
    maker_id: 'maker-honeycomb-hills',
    category: 'honey',
    price: 14,
    ingredients: 'Raw locust blossom honey',
    allergens: [],
    made_on: '2026-06-12',
    shelf_life: '2 years',
    left_this_week: 10,
    photo: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80',
  },
  {
    id: 'item-basswood-honey',
    name: 'Basswood Summer Honey',
    maker_id: 'maker-honeycomb-hills',
    category: 'honey',
    price: 15,
    ingredients: 'Raw basswood honey',
    allergens: [],
    made_on: '2026-07-08',
    shelf_life: '2 years',
    left_this_week: 7,
    photo: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80',
  },
  {
    id: 'item-wildflower-honey',
    name: 'Fall Wildflower Honey',
    maker_id: 'maker-honeycomb-hills',
    category: 'honey',
    price: 14,
    ingredients: 'Raw fall wildflower honey',
    allergens: [],
    made_on: '2026-09-14',
    shelf_life: '2 years',
    left_this_week: 12,
    photo: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&q=80',
  },
  {
    id: 'item-comb-cut',
    name: 'Cut Comb Square',
    maker_id: 'maker-honeycomb-hills',
    category: 'honey',
    price: 9,
    ingredients: 'Raw honeycomb',
    allergens: [],
    made_on: '2026-08-22',
    shelf_life: '1 year',
    left_this_week: 5,
    photo: 'https://images.unsplash.com/photo-1587049081549-ea3c0c3f7dcb?w=800&q=80',
  },
  {
    id: 'item-brown-butter-chip',
    name: 'Brown Butter Chocolate Chip',
    maker_id: 'maker-night-oven',
    category: 'cookies',
    price: 8,
    ingredients: 'Flour, brown butter, brown sugar, eggs, dark chocolate, sea salt, baking soda',
    allergens: ['wheat', 'milk', 'eggs'],
    made_on: '2026-10-03',
    shelf_life: '5 days',
    left_this_week: 14,
    photo: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80',
  },
  {
    id: 'item-salted-tahini',
    name: 'Salted Tahini Cookie',
    maker_id: 'maker-night-oven',
    category: 'cookies',
    price: 8,
    ingredients: 'Flour, tahini, brown sugar, eggs, sesame seeds, baking soda, salt',
    allergens: ['wheat', 'eggs', 'sesame'],
    made_on: '2026-10-03',
    shelf_life: '5 days',
    left_this_week: 9,
    photo: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80',
  },
  {
    id: 'item-double-cocoa',
    name: 'Double Cocoa Rye Cookie',
    maker_id: 'maker-night-oven',
    category: 'cookies',
    price: 9,
    ingredients: 'Rye flour, cocoa, butter, eggs, dark chocolate, sugar, salt',
    allergens: ['wheat', 'milk', 'eggs'],
    made_on: '2026-10-02',
    shelf_life: '5 days',
    left_this_week: 8,
    photo: 'https://images.unsplash.com/photo-1618923850107-8c1d0d43b366?w=800&q=80',
  },
  {
    id: 'item-lavender-shortbread',
    name: 'Lavender Shortbread',
    maker_id: 'maker-washtenaw-wildflower',
    category: 'cookies',
    price: 9,
    ingredients: 'Flour, butter, sugar, culinary lavender, vanilla, salt',
    allergens: ['wheat', 'milk'],
    made_on: '2026-10-01',
    shelf_life: '10 days',
    left_this_week: 10,
    photo: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&q=80',
  },
  {
    id: 'item-jam-thumbprint',
    name: 'Sour Cherry Thumbprint',
    maker_id: 'maker-washtenaw-wildflower',
    category: 'cookies',
    price: 9,
    ingredients: 'Flour, butter, sugar, egg, sour cherry conserve, salt',
    allergens: ['wheat', 'milk', 'eggs'],
    made_on: '2026-10-02',
    shelf_life: '7 days',
    left_this_week: 7,
    photo: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&q=80',
  },
];

export const meetupSpots: MeetupSpot[] = [
  {
    id: 'spot-aadl-downtown',
    name: 'Ann Arbor District Library – Downtown',
    kind: 'library',
    address: '343 S Fifth Ave, Ann Arbor, MI 48104',
    notes: 'Lobby pickup table on Saturday mornings. Staffed public building with restrooms and parking nearby.',
  },
  {
    id: 'spot-aapd-exchange',
    name: 'AAPD Safe Exchange Zone',
    kind: 'police-safe-exchange',
    address: '301 E Huron St, Ann Arbor, MI 48104',
    notes: 'City Hall police safe-exchange lot. Camera-covered, well lit, and meant for quick handoffs.',
  },
  {
    id: 'spot-argus-cafe',
    name: 'Argus Farm Stop Café',
    kind: 'cafe',
    address: '325 W Liberty St, Ann Arbor, MI 48103',
    notes: 'West-side café counter. Grab a coffee while boxes land on the labeled Savor shelf.',
  },
  {
    id: 'spot-kerrytown-market',
    name: 'Ann Arbor Farmers Market',
    kind: 'farmers-market',
    address: '315 Detroit St, Ann Arbor, MI 48104',
    notes: 'Kerrytown sheds on market days. Meet at the clock after 10am; bring a tote.',
  },
];

const defaultReason = '12 regulars + rainy Saturday + last 3 weeks avg 36';

export const forecasts: Record<string, Forecast> = {
  'item-country-sourdough': { suggested: 40, sold: 38, reason: defaultReason },
  'item-maple-sandwich-loaf': {
    suggested: 28,
    sold: 26,
    reason: 'School-week sandwich demand + 8 regulars + last 3 weeks avg 24',
  },
  'item-seeded-rye': {
    suggested: 18,
    sold: 17,
    reason: 'Deli slice crowd + cooler weather + last 3 weeks avg 16',
  },
  'item-cinnamon-swirl': {
    suggested: 16,
    sold: 16,
    reason: 'Weekend treat bake + 6 standing orders + last 3 weeks avg 14',
  },
  'item-strawberry-rhubarb': {
    suggested: 24,
    sold: 21,
    reason: 'Late-season fruit run + gift buyers + last 3 weeks avg 20',
  },
  'item-peach-vanilla': {
    suggested: 20,
    sold: 19,
    reason: 'Peach nostalgia + brunch pairings + last 3 weeks avg 18',
  },
  'item-blackberry-sage': {
    suggested: 22,
    sold: 20,
    reason: 'Cheese-board pairings + 9 regulars + last 3 weeks avg 19',
  },
  'item-sour-cherry': {
    suggested: 15,
    sold: 14,
    reason: 'Limited jars left + holiday gifters + last 3 weeks avg 12',
  },
  'item-classic-cluster': { suggested: 40, sold: 38, reason: defaultReason },
  'item-maple-pecan-granola': {
    suggested: 26,
    sold: 24,
    reason: 'Breakfast restocks + pecan season + last 3 weeks avg 23',
  },
  'item-cacao-cherry-granola': {
    suggested: 20,
    sold: 18,
    reason: 'Trail-mix crowd + rainy Saturday + last 3 weeks avg 17',
  },
  'item-spring-locust': {
    suggested: 18,
    sold: 16,
    reason: 'Light floral fans + tea pairings + last 3 weeks avg 15',
  },
  'item-basswood-honey': {
    suggested: 16,
    sold: 15,
    reason: 'Summer leftover restock + 5 regulars + last 3 weeks avg 14',
  },
  'item-wildflower-honey': {
    suggested: 30,
    sold: 28,
    reason: 'Fall dark-honey demand + baking week + last 3 weeks avg 26',
  },
  'item-comb-cut': {
    suggested: 12,
    sold: 11,
    reason: 'Curiosity buys + kids at market + last 3 weeks avg 10',
  },
  'item-brown-butter-chip': { suggested: 40, sold: 38, reason: defaultReason },
  'item-salted-tahini': {
    suggested: 24,
    sold: 22,
    reason: 'Sesame regulars + office boxes + last 3 weeks avg 21',
  },
  'item-double-cocoa': {
    suggested: 20,
    sold: 19,
    reason: 'Chocolate weekend + 7 standing orders + last 3 weeks avg 18',
  },
  'item-lavender-shortbread': {
    suggested: 22,
    sold: 20,
    reason: 'Tea-time gifters + rainy Saturday + last 3 weeks avg 19',
  },
  'item-jam-thumbprint': {
    suggested: 18,
    sold: 17,
    reason: 'Conserve crossover + 12 regulars + last 3 weeks avg 16',
  },
};

export type BoxCadence = 'one-time' | 'weekly';
export type PickupWindow = '9-10' | '10-11' | '11-12';
export type OrderStatus = 'Confirmed' | 'Being made' | 'Ready for pickup' | 'Picked up';

export type OrderLine = {
  itemId: string;
  quantity: number;
};

export type Order = {
  id: string;
  status: OrderStatus;
  items: OrderLine[];
  spotId: string;
  window: PickupWindow;
  cadence: BoxCadence;
  total: number;
};

export const lastWeekBox: OrderLine[] = [
  { itemId: 'item-country-sourdough', quantity: 1 },
  { itemId: 'item-strawberry-rhubarb', quantity: 2 },
  { itemId: 'item-classic-cluster', quantity: 1 },
  { itemId: 'item-brown-butter-chip', quantity: 1 },
];

export const pickupWindows: { id: PickupWindow; label: string; spoken: string }[] = [
  { id: '9-10', label: 'Sat 9-10', spoken: 'Saturday 9-10am' },
  { id: '10-11', label: 'Sat 10-11', spoken: 'Saturday 10-11am' },
  { id: '11-12', label: 'Sat 11-12', spoken: 'Saturday 11am-12pm' },
];

export const mockOrders: Order[] = [
  {
    id: 'order-confirmed',
    status: 'Confirmed',
    items: [
      { itemId: 'item-maple-sandwich-loaf', quantity: 1 },
      { itemId: 'item-peach-vanilla', quantity: 1 },
    ],
    spotId: 'spot-kerrytown-market',
    window: '10-11',
    cadence: 'one-time',
    total: 20,
  },
  {
    id: 'order-being-made',
    status: 'Being made',
    items: [
      { itemId: 'item-cinnamon-swirl', quantity: 1 },
      { itemId: 'item-salted-tahini', quantity: 2 },
    ],
    spotId: 'spot-aadl-downtown',
    window: '9-10',
    cadence: 'weekly',
    total: 28,
  },
  {
    id: 'order-ready',
    status: 'Ready for pickup',
    items: [{ itemId: 'item-wildflower-honey', quantity: 1 }],
    spotId: 'spot-aapd-exchange',
    window: '11-12',
    cadence: 'one-time',
    total: 14,
  },
  {
    id: 'order-picked-up',
    status: 'Picked up',
    items: [
      { itemId: 'item-lavender-shortbread', quantity: 1 },
      { itemId: 'item-blackberry-sage', quantity: 1 },
    ],
    spotId: 'spot-argus-cafe',
    window: '10-11',
    cadence: 'one-time',
    total: 21,
  },
];

export function getMaker(id: string) {
  return makers.find((maker) => maker.id === id);
}

export function getItem(id: string) {
  return items.find((item) => item.id === id);
}

export function getForecast(itemId: string) {
  return forecasts[itemId];
}

export function getMeetupSpot(id: string) {
  return meetupSpots.find((spot) => spot.id === id);
}

export function getItemsByMaker(makerId: string) {
  return items.filter((item) => item.maker_id === makerId);
}
