import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { Listing, LegalityResult, StateRules } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
// rules/ sits next to src/ (server/rules). src is compiled to dist, so resolve
// relative to the project root for both `tsx` (src) and `node dist` runs.
const rulesDir = join(__dirname, "..", "rules");

const cache = new Map<string, StateRules | null>();

export function loadRules(state: string): StateRules | null {
  const key = state.trim().toUpperCase();
  if (cache.has(key)) return cache.get(key) ?? null;

  try {
    const raw = readFileSync(join(rulesDir, `${key}.json`), "utf-8");
    const parsed = JSON.parse(raw) as StateRules;
    cache.set(key, parsed);
    return parsed;
  } catch {
    cache.set(key, null);
    return null;
  }
}

/**
 * Builds a searchable blob of text from the listing so we can match it against
 * the state's blocked/allowed keyword lists.
 */
function listingText(listing: Listing): string {
  return [
    listing.name,
    listing.category,
    listing.description,
    ...listing.ingredients,
    ...listing.allergens,
  ]
    .join(" ")
    .toLowerCase();
}

/**
 * Turns a rule phrase like "cakes (no cream cheese frosting)" into the core
 * keywords we actually want to look for.
 */
function keywordsFromRule(rule: string): string[] {
  return rule
    .toLowerCase()
    .replace(/\(.*?\)/g, " ") // drop parenthetical qualifiers
    .split(/,| or |\band\b|\//)
    .map((s) => s.trim())
    .filter(Boolean);
}

function matches(text: string, rule: string): boolean {
  return keywordsFromRule(rule).some((kw) => kw.length > 0 && text.includes(kw));
}

export function checkLegality(listing: Listing, state: string): LegalityResult {
  const rules = loadRules(state);

  if (!rules) {
    return {
      is_legal: false,
      reason: `No cottage-food rules on file for state "${state}". Supported states: MI, WY.`,
    };
  }

  const text = listingText(listing);

  // Generic blocks like "dairy"/"milk" refer to dairy *products* (needing
  // refrigeration), not to butter/milk used as ingredients in an otherwise
  // allowed baked good. So they can be overridden when the item is explicitly
  // allowed. "cheese", "cream or custard fillings", meat, pickles, etc. are
  // always disqualifying.
  const OVERRIDABLE_BLOCKS = new Set(["dairy", "milk"]);

  const blockedHits = rules.blocked.filter((rule) => matches(text, rule));
  const allowedHit = rules.allowed.find((rule) => matches(text, rule));

  // 1) Hard blocks always disqualify.
  const hardBlocked = blockedHits.filter(
    (rule) => !OVERRIDABLE_BLOCKS.has(rule.trim().toLowerCase()),
  );
  if (hardBlocked.length > 0) {
    return {
      is_legal: false,
      reason: `Not allowed under ${rules.name} cottage-food law: contains or resembles a blocked item ("${hardBlocked[0]}").`,
      required_label: rules.required_label,
      special: rules.special,
    };
  }

  // 2) Only generic (overridable) blocks matched, and the item is NOT an
  // explicitly allowed type -> treat as blocked to stay on the safe side.
  if (blockedHits.length > 0 && !allowedHit) {
    return {
      is_legal: false,
      reason: `Not allowed under ${rules.name} cottage-food law: contains or resembles a blocked item ("${blockedHits[0]}").`,
      required_label: rules.required_label,
      special: rules.special,
    };
  }

  // 3) Explicitly allowed item.
  if (allowedHit) {
    return {
      is_legal: true,
      reason: `Allowed under ${rules.name} cottage-food law (matches "${allowedHit}"). ${
        rules.required_label
          ? `Label required: "${rules.required_label}".`
          : ""
      }${rules.special ? ` Note: ${rules.special}` : ""}`.trim(),
      required_label: rules.required_label,
      special: rules.special,
    };
  }

  // 4) Not explicitly blocked, not explicitly allowed.
  // Wyoming's Food Freedom Act permits "most homemade foods", so default allow.
  const defaultAllow = rules.allowed.some((a) =>
    a.toLowerCase().includes("most homemade foods"),
  );

  if (defaultAllow) {
    return {
      is_legal: true,
      reason: `Allowed under ${rules.name} law, which permits most homemade foods (nothing on the blocked list detected).`,
      required_label: rules.required_label,
      special: rules.special,
    };
  }

  return {
    is_legal: false,
    reason: `Could not confirm this item is on ${rules.name}'s allowed cottage-food list. Review manually before selling.`,
    required_label: rules.required_label,
    special: rules.special,
  };
}
