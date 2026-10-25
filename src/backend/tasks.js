/*
 * To-do list storage. Tasks are kept in data/tasks.json so they survive a server restart.
 * A task is { id, name, completeBy, due } where both dates are "MM/DD" (or "" when not set);
 * daysLeft is worked out from the due date every time tasks are sent to the page.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FILE = join(dirname(fileURLToPath(import.meta.url)), "../../data/tasks.json");
const DAY = 24 * 60 * 60 * 1000;

function load() {
  try {
    return JSON.parse(readFileSync(FILE, "utf8"));
  } catch {
    return { nextId: 1, tasks: [] };
  }
}

function save(store) {
  mkdirSync(dirname(FILE), { recursive: true });
  writeFileSync(FILE, JSON.stringify(store, null, 2));
}

/* "MM/DD" -> { month, day }, or null if it isn't a real date (Feb 29 is allowed). */
export function parseDate(text) {
  const match = /^(\d{1,2})\/(\d{1,2})$/.exec(text);
  if (!match) return null;
  const month = Number(match[1]);
  const day = Number(match[2]);
  const daysInMonth = new Date(2024, month, 0).getDate(); // 2024 is a leap year
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth) return null;
  return { month, day };
}

/* Whole days from today until "MM/DD". Dates more than six months in the past are taken to
   mean next year (e.g. a 01/10 deadline written in December); anything else this year, so a
   recently missed deadline comes out negative. */
export function daysUntil(text, today = new Date()) {
  const date = parseDate(text);
  if (!date) return null;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let target = new Date(start.getFullYear(), date.month - 1, date.day);
  if ((start - target) / DAY > 182) target = new Date(start.getFullYear() + 1, date.month - 1, date.day);
  return Math.round((target - start) / DAY);
}

/* Normalises the fields the page sends; throws an Error with a friendly message when invalid. */
function clean(input) {
  const name = String(input?.name ?? "").trim();
  if (!name) throw new Error("Give the task a name");

  const fields = { name };
  for (const [key, label] of [["completeBy", "Complete by"], ["due", "Due"]]) {
    const text = String(input?.[key] ?? "").trim();
    if (text && !parseDate(text)) throw new Error(`${label} must be a real date written as MM/DD`);
    const date = parseDate(text);
    fields[key] = date ? `${String(date.month).padStart(2, "0")}/${String(date.day).padStart(2, "0")}` : "";
  }
  return fields;
}

const withDaysLeft = (task) => ({ ...task, daysLeft: task.due ? daysUntil(task.due) : null });

export function listTasks() {
  return load().tasks.map(withDaysLeft);
}

export function addTask(input) {
  const store = load();
  const task = { id: store.nextId++, ...clean(input) };
  store.tasks.push(task);
  save(store);
  return withDaysLeft(task);
}

export function updateTask(id, input) {
  const store = load();
  const task = store.tasks.find((t) => t.id === id);
  if (!task) return null;
  Object.assign(task, clean(input));
  save(store);
  return withDaysLeft(task);
}

export function removeTask(id) {
  const store = load();
  const before = store.tasks.length;
  store.tasks = store.tasks.filter((t) => t.id !== id);
  if (store.tasks.length === before) return false;
  save(store);
  return true;
}
