/*
 * Sand dollars and the fish in the user's aquarium, kept in data/aquarium.json.
 * Completing a to-do task earns sand dollars; the fish shop spends them.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FILE = join(dirname(fileURLToPath(import.meta.url)), "../../data/aquarium.json");

export const TASK_REWARD = 5;

// Shop prices in sand dollars (must match the prices shown in the fish shop).
export const PRICES = { teal: 10, brown: 20, yellow: 1000, blue: 30, orange: 25, angelfish: 100 };

// The aquarium starts with just the orange fish; every other fish is bought in the shop.
const STARTING_FISH = ["orange"];

function load() {
  try {
    return JSON.parse(readFileSync(FILE, "utf8"));
  } catch {
    return { balance: 0, owned: [...STARTING_FISH] };
  }
}

function save(state) {
  mkdirSync(dirname(FILE), { recursive: true });
  writeFileSync(FILE, JSON.stringify(state, null, 2));
}

export function getAquarium() {
  return load();
}

export function earn(amount) {
  const state = load();
  state.balance += amount;
  save(state);
  return state;
}

/* Spends sand dollars on a fish and adds it to the aquarium; throws with a friendly message if not allowed. */
export function buyFish(fish) {
  if (!(fish in PRICES)) throw new Error("That fish isn't for sale");
  const state = load();
  if (state.owned.includes(fish)) throw new Error("That fish is already in your aquarium");
  if (state.balance < PRICES[fish]) {
    throw new Error(`You need ${PRICES[fish] - state.balance} more sand dollars for that fish`);
  }
  state.balance -= PRICES[fish];
  state.owned.push(fish);
  save(state);
  return state;
}
