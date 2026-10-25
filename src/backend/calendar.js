/*
 * Weekly calendar entries, kept in data/calendar.json.
 * An entry is { id, title, day, due, color }: day is 0 (Monday) to 6 (Sunday), due is optional
 * text such as "11:59 pm" or "10/31", and color is one of COLORS.
 * The first time the calendar is opened it starts with the example week from the design.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FILE = join(dirname(fileURLToPath(import.meta.url)), "../../data/calendar.json");

export const COLORS = ["#f71266", "#4dc8c0", "#1b6fed", "#f9ffc3", "#f5df86", "#202256"];

const EXAMPLE_WEEK = [
  { title: "MATH 151 HW", day: 0, due: "11:59 pm", color: "#f71266" },
  { title: "Post lab", day: 0, due: "5:00 pm", color: "#4dc8c0" },
  { title: "Robotics team meeting", day: 0, due: "", color: "#202256" },
  { title: "Career fair", day: 1, due: "", color: "#202256" },
  { title: "ENGR 102 HW", day: 1, due: "11:59 pm", color: "#1b6fed" },
  { title: "CHEM 107 HW", day: 1, due: "11:59 pm", color: "#f9ffc3" },
  { title: "MATH LAB", day: 2, due: "2:00 pm", color: "#f71266" },
  { title: "Social event", day: 2, due: "", color: "#202256" },
  { title: "Study for POLS 207", day: 3, due: "", color: "#f5df86" },
  { title: "CHEM 107 HW", day: 3, due: "3:00 pm", color: "#f9ffc3" },
  { title: "Club Meeting", day: 4, due: "", color: "#202256" },
  { title: "CHEM 107 HW", day: 5, due: "3:00 pm", color: "#f9ffc3" },
  { title: "Study for Math 151", day: 6, due: "", color: "#f71266" },
];

function load() {
  try {
    return JSON.parse(readFileSync(FILE, "utf8"));
  } catch {
    return { nextId: EXAMPLE_WEEK.length + 1, entries: EXAMPLE_WEEK.map((e, i) => ({ id: i + 1, ...e })) };
  }
}

function save(store) {
  mkdirSync(dirname(FILE), { recursive: true });
  writeFileSync(FILE, JSON.stringify(store, null, 2));
}

/* Normalises the fields the page sends; throws an Error with a friendly message when invalid. */
function clean(input) {
  const title = String(input?.title ?? "").trim();
  if (!title) throw new Error("Give the entry a name");
  if (title.length > 60) throw new Error("Keep the name under 60 characters");

  const day = Number(input?.day);
  if (!Number.isInteger(day) || day < 0 || day > 6) throw new Error("Pick a day of the week");

  const due = String(input?.due ?? "").trim();
  if (due.length > 20) throw new Error("Keep the due date short, like 11:59 pm or 10/31");

  const color = COLORS.includes(input?.color) ? input.color : COLORS[0];
  return { title, day, due, color };
}

export function listEntries() {
  return load().entries;
}

export function addEntry(input) {
  const store = load();
  const entry = { id: store.nextId++, ...clean(input) };
  store.entries.push(entry);
  save(store);
  return entry;
}

/* Edits an entry. Moving it to a different day puts it at the bottom of that day. */
export function updateEntry(id, input) {
  const store = load();
  const index = store.entries.findIndex((e) => e.id === id);
  if (index === -1) return null;
  const entry = { id, ...clean({ ...store.entries[index], ...input }) };
  if (entry.day !== store.entries[index].day) {
    store.entries.splice(index, 1);
    store.entries.push(entry);
  } else {
    store.entries[index] = entry;
  }
  save(store);
  return entry;
}

export function removeEntry(id) {
  const store = load();
  const before = store.entries.length;
  store.entries = store.entries.filter((e) => e.id !== id);
  if (store.entries.length === before) return false;
  save(store);
  return true;
}
