import { createServer } from "node:http";
import { calculateGpa } from "./gpa.js";
import { addTask, listTasks, removeTask, updateTask } from "./tasks.js";
import { TASK_REWARD, buyFish, earn, getAquarium } from "./aquarium.js";
import { addEntry, listEntries, removeEntry, updateEntry } from "./calendar.js";

const PORT = Number(process.env.PORT) || 3001;

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 100_000) req.destroy();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch {
        reject(new Error("Request body must be JSON"));
      }
    });
    req.on("error", reject);
  });
}

/*
 * POST   /api/gpa        { classes: [{ subject, grade, hours }] } -> { gpa, totalPoints, totalHours }
 * GET    /api/tasks      -> [{ id, name, completeBy, due, daysLeft }]
 * POST   /api/tasks      { name, completeBy, due } -> the new task
 * PUT    /api/tasks/:id  { name, completeBy, due } -> the updated task
 * DELETE /api/tasks/:id  -> { ok: true }
 * POST   /api/tasks/:id/complete -> { balance, owned }   (removes the task and pays the reward)
 * GET    /api/aquarium   -> { balance, owned: ["angelfish", ...] }
 * POST   /api/shop/buy   { fish } -> { balance, owned }
 * GET    /api/calendar   -> [{ id, title, day, due, color }]   (day: 0 = Monday ... 6 = Sunday)
 * POST   /api/calendar   { title, day, due, color } -> the new entry
 * PUT    /api/calendar/:id  { title?, day?, due?, color? } -> the updated entry   (also used to drag to another day)
 * DELETE /api/calendar/:id  -> { ok: true }
 */
const server = createServer(async (req, res) => {
  const { method, url } = req;
  const taskId = Number(/^\/api\/tasks\/(\d+)$/.exec(url)?.[1]);
  const completedId = Number(/^\/api\/tasks\/(\d+)\/complete$/.exec(url)?.[1]);
  const entryId = Number(/^\/api\/calendar\/(\d+)$/.exec(url)?.[1]);

  try {
    if (method === "POST" && url === "/api/gpa") {
      const { classes } = await readJson(req);
      return send(res, 200, calculateGpa(classes));
    }
    if (method === "GET" && url === "/api/tasks") {
      return send(res, 200, listTasks());
    }
    if (method === "POST" && url === "/api/tasks") {
      return send(res, 201, addTask(await readJson(req)));
    }
    if (method === "PUT" && taskId) {
      const task = updateTask(taskId, await readJson(req));
      return task ? send(res, 200, task) : send(res, 404, { error: "Task not found" });
    }
    if (method === "DELETE" && taskId) {
      return removeTask(taskId) ? send(res, 200, { ok: true }) : send(res, 404, { error: "Task not found" });
    }
    if (method === "POST" && completedId) {
      return removeTask(completedId) ? send(res, 200, earn(TASK_REWARD)) : send(res, 404, { error: "Task not found" });
    }
    if (method === "GET" && url === "/api/aquarium") {
      return send(res, 200, getAquarium());
    }
    if (method === "POST" && url === "/api/shop/buy") {
      const { fish } = await readJson(req);
      return send(res, 200, buyFish(fish));
    }
    if (method === "GET" && url === "/api/calendar") {
      return send(res, 200, listEntries());
    }
    if (method === "POST" && url === "/api/calendar") {
      return send(res, 201, addEntry(await readJson(req)));
    }
    if (method === "PUT" && entryId) {
      const entry = updateEntry(entryId, await readJson(req));
      return entry ? send(res, 200, entry) : send(res, 404, { error: "Entry not found" });
    }
    if (method === "DELETE" && entryId) {
      return removeEntry(entryId) ? send(res, 200, { ok: true }) : send(res, 404, { error: "Entry not found" });
    }
    send(res, 404, { error: "Not found" });
  } catch (err) {
    send(res, 400, { error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`Aquarium backend listening on http://localhost:${PORT}`);
});
