/**
 * Same reply logic as fetch_agent/agent.py.
 * Used in the app when Kod's server (main) does not have POST /ai/agent.
 */
const ITEMS = [
  { id: 'item-1', name: 'Classic Sourdough Loaf', price: 9, allergens: ['wheat'], left_this_week: 12 },
  { id: 'item-2', name: 'Michigan Cherry Pie', price: 22, allergens: ['wheat', 'dairy'], left_this_week: 5 },
  { id: 'item-3', name: 'Strawberry Jam', price: 8, allergens: [], left_this_week: 20 },
  { id: 'item-4', name: 'Wildflower Honey', price: 10, allergens: [], left_this_week: 15 },
  { id: 'item-5', name: 'Chocolate Chip Cookies (6-pack)', price: 12, allergens: ['wheat', 'dairy', 'eggs'], left_this_week: 30 },
  { id: 'item-6', name: 'Maple Almond Granola', price: 11, allergens: ['nuts'], left_this_week: 18 },
];

const SPOTS = [
  { name: 'Ann Arbor Farmers Market', address: '315 Detroit St, Ann Arbor, MI 48104', keys: ['farmers', 'kerrytown'] },
  { name: 'Ann Arbor District Library - Downtown', address: '343 S Fifth Ave, Ann Arbor, MI 48104', keys: ['library'] },
  { name: 'Nichols Arboretum', address: '1610 Washington Heights, Ann Arbor, MI 48104', keys: ['arboretum'] },
  { name: 'University of Michigan Diag', address: '913 S University Ave, Ann Arbor, MI 48109', keys: ['diag', 'campus'] },
];

const BAD = ['pickle', 'canned', 'canning', 'cream cheese', 'custard', 'meat', 'fermented'];

function getBudget(q: string): number {
  const dollar = q.match(/\$\s*(\d+(?:\.\d+)?)/);
  if (dollar) {
    return Number(dollar[1]);
  }
  const words = q.toLowerCase().match(/(?:under|below|less than|max|budget)\s*\$?\s*(\d+(?:\.\d+)?)/);
  if (words) {
    return Number(words[1]);
  }
  return 30;
}

function pickSpot(ql: string) {
  for (const s of SPOTS) {
    if (s.keys.some((k) => ql.includes(k))) {
      return s;
    }
  }
  return SPOTS[0];
}

function legalAnswer(ql: string): string {
  for (const p of BAD) {
    if (ql.includes(p)) {
      return 'NO. Michigan cottage food rules do not allow home-pickled, canned, or low-acid foods without a commercial kitchen license (botulism risk). [REJECTED_NON_COMPLIANT]';
    }
  }
  return 'YES. Standard baked goods, jams, granola, and dry mixes are generally allowed under Michigan cottage food rules. [APPROVED]';
}

function forecastAnswer(): string {
  return 'List 40: about 12 regulars + a rainy Saturday + a 36-loaf average over the last 3 weeks. [FORECAST_GENERATED]';
}

function orderId(): string {
  return 'ORD-' + Math.random().toString(16).slice(2, 8).toUpperCase();
}

function orderAnswer(q: string, ql: string): string {
  const budget = getBudget(q);
  const nutFree = ql.includes('nut');
  const picks: typeof ITEMS = [];
  let total = 0;
  for (const it of ITEMS) {
    const hasNut = it.allergens.some((a) => a.includes('nut'));
    if (nutFree && hasNut) {
      continue;
    }
    if (it.left_this_week <= 0) {
      continue;
    }
    if (total + it.price > budget) {
      continue;
    }
    picks.push(it);
    total += it.price;
  }
  if (picks.length === 0) {
    return 'I could not find anything for that budget and diet.';
  }
  const spot = pickSpot(ql);
  const names = picks.map((p) => p.name).join(', ');
  const ids = picks.map(() => orderId()).join(', ');
  return (
    'Ordered ' +
    names +
    ' for $' +
    total.toFixed(2) +
    '. Pickup: ' +
    spot.name +
    ' (' +
    spot.address +
    '). Order IDs: ' +
    ids
  );
}

export function cottageAgentReply(question: string): string {
  const q = question.trim();
  const ql = q.toLowerCase();
  if (ql.includes('pickle') || ql.includes('can i sell') || ql.includes('legal')) {
    return legalAnswer(ql);
  }
  if (ql.includes('sourdough') || ql.includes('how much') || ql.includes('bake')) {
    return forecastAnswer();
  }
  for (const w of ['box', 'order', 'buy', '$', 'nut']) {
    if (ql.includes(w)) {
      return orderAnswer(q, ql);
    }
  }
  return 'I am the Cottage AI agent. Ask me to order a box (e.g. nut-free breakfast box under $30), check if a food is legal to sell in Michigan, or forecast how much to bake.';
}
