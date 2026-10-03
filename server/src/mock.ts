import type { Listing } from "./types.js";

/**
 * Realistic hardcoded listings used when running in MOCK_AI mode (no live LLM).
 * Keyed by a lowercase "hint" sent in the request.
 */
const MOCK_LISTINGS: Record<string, Listing> = {
  jam: {
    name: "Strawberry Jam",
    category: "jam",
    description:
      "Small-batch strawberry jam made with ripe berries and just enough sugar to let the fruit shine. Perfect on toast or scones.",
    suggested_price: 8,
    ingredients: ["strawberries", "sugar", "lemon juice", "fruit pectin"],
    allergens: [],
  },
  pickles: {
    name: "Dill Pickles",
    category: "pickles",
    description:
      "Crisp, garlicky dill pickles packed in a tangy brine. A crunchy snack or sandwich companion.",
    suggested_price: 7,
    ingredients: ["cucumbers", "vinegar", "water", "dill", "garlic", "salt"],
    allergens: [],
  },
  bread: {
    name: "Sourdough Bread",
    category: "bread",
    description:
      "Naturally leavened sourdough with a crackly crust and an open, chewy crumb. Baked fresh from a decades-old starter.",
    suggested_price: 9,
    ingredients: ["flour", "water", "salt", "sourdough starter"],
    allergens: ["wheat"],
  },
  cookies: {
    name: "Chocolate Chip Cookies",
    category: "baked goods",
    description:
      "Soft-baked chocolate chip cookies with crisp edges and gooey centers. Sold by the half dozen.",
    suggested_price: 12,
    ingredients: [
      "flour",
      "butter",
      "brown sugar",
      "chocolate chips",
      "eggs",
      "vanilla",
    ],
    allergens: ["wheat", "dairy", "eggs"],
  },
  cake: {
    name: "Vanilla Layer Cake",
    category: "cakes",
    description:
      "A tender two-layer vanilla cake finished with silky buttercream. Great for birthdays and celebrations.",
    suggested_price: 28,
    ingredients: ["flour", "sugar", "butter", "eggs", "milk", "vanilla"],
    allergens: ["wheat", "dairy", "eggs"],
  },
  honey: {
    name: "Wildflower Honey",
    category: "honey",
    description:
      "Raw, unfiltered wildflower honey harvested from local hives. Floral, golden, and never heat-treated.",
    suggested_price: 10,
    ingredients: ["honey"],
    allergens: [],
  },
  granola: {
    name: "Maple Almond Granola",
    category: "granola",
    description:
      "Crunchy clusters of oats, almonds, and maple syrup baked low and slow. A wholesome breakfast or snack.",
    suggested_price: 11,
    ingredients: ["oats", "almonds", "maple syrup", "coconut oil", "cinnamon"],
    allergens: ["nuts"],
  },
  candy: {
    name: "Sea Salt Caramels",
    category: "candy",
    description:
      "Buttery soft caramels sprinkled with flaky sea salt and wrapped by hand.",
    suggested_price: 9,
    ingredients: ["sugar", "cream", "butter", "sea salt"],
    allergens: ["dairy"],
  },
  // Items below are intentionally "blocked" in some states for easy demos.
  cheese: {
    name: "Aged Cheddar Cheese",
    category: "cheese",
    description:
      "Sharp farmhouse cheddar aged for twelve months. Must be kept refrigerated.",
    suggested_price: 15,
    ingredients: ["milk", "salt", "cultures", "rennet"],
    allergens: ["dairy"],
  },
  salsa: {
    name: "Fresh Tomato Salsa",
    category: "salsa",
    description:
      "Bright, chunky salsa with ripe tomatoes, onion, cilantro, and lime.",
    suggested_price: 8,
    ingredients: ["tomatoes", "onion", "jalapeno", "cilantro", "lime", "salt"],
    allergens: [],
  },
};

/**
 * Returns a realistic mock listing for the given hint. Falls back to a generic
 * listing derived from the hint when it isn't in the preset table.
 */
export function mockListing(hint?: string): Listing {
  const key = (hint ?? "").trim().toLowerCase();

  if (key && MOCK_LISTINGS[key]) {
    return MOCK_LISTINGS[key];
  }

  const label = key
    ? key.charAt(0).toUpperCase() + key.slice(1)
    : "Homemade Treat";

  return {
    name: label,
    category: key || "other",
    description: `Homemade ${key || "treat"} made in small batches with simple, quality ingredients.`,
    suggested_price: 10,
    ingredients: ["homemade"],
    allergens: [],
  };
}
