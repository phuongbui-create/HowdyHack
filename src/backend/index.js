import { createServer } from "node:http";
import { calculateGpa } from "./gpa.js";

const PORT = Number(process.env.PORT) || 3001;

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

/* POST /api/gpa  { classes: [{ subject, grade, hours }] }  ->  { gpa, totalPoints, totalHours } */
const server = createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/api/gpa") {
    return send(res, 404, { error: "Not found" });
  }

  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 100_000) req.destroy();
  });
  req.on("end", () => {
    try {
      const { classes } = JSON.parse(raw || "{}");
      send(res, 200, calculateGpa(classes));
    } catch (err) {
      send(res, 400, { error: err.message });
    }
  });
});

server.listen(PORT, () => {
  console.log(`GPA backend listening on http://localhost:${PORT}`);
});
