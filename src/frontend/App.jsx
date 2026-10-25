import { useEffect, useState } from "react";

/* Shared page frame. The design is a fixed 1280x832 canvas scaled to fit the window. */
function Layout({ title, page, children }) {
  useEffect(() => {
    document.title = title;
    const fit = () => {
      const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 832);
      document.documentElement.style.setProperty("--scale", String(scale));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [title]);

  return (
    <div className="viewport">
      <main className={"stage " + page}>{children}</main>
    </div>
  );
}

/* Talks to the backend (src/backend); throws with the server's message when a request is refused */
async function api(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

/* House icon that returns to the home page */
function HomeLink() {
  return (
    <a className="abs home-link" href="/" aria-label="Home">
      <img src="/images/home.svg" width="77.2318" height="56.9597" alt="" />
    </a>
  );
}

/* ---------- Fish that float in the aquarium ---------- */
/* Each image has empty space around the fish, so the crop zooms in on just the fish. */
const FISH = {
  angelfish: { src: "/images/home-angelfish.png", w: 150, h: 136,
    crop: { left: "-19.09%", top: "-31.46%", width: "154.62%", height: "161.65%" } },
  orange: { src: "/images/fish-orange.png", w: 170, h: 105,
    crop: { left: "-7.07%", top: "-74.53%", width: "110.82%", height: "179.44%" } },
  teal: { src: "/images/fish-teal.png", w: 190, h: 89,
    crop: { left: "-18.04%", top: "-37.16%", width: "121.52%", height: "259.46%" } },
  yellow: { src: "/images/fish-yellow.png", w: 135, h: 105,
    crop: { left: "-153.72%", top: "-18.26%", width: "259.46%", height: "333.91%" } },
  brown: { src: "/images/fish-brown.png", w: 190, h: 60,
    crop: { left: "-5.96%", top: "-275.63%", width: "123.67%", height: "389.85%" } },
  blue: { src: "/images/fish-blue.png", w: 150, h: 110,
    crop: { left: "-7.66%", top: "-10.41%", width: "178.19%", height: "242.27%" } },
};

/* Where each fish sits (its centre point), which way it faces, and its bobbing rhythm.
   Fish on the left face right and fish on the right face left, so pairs face each other.
   Only fish the user owns are shown; the rest appear once they are bought in the shop. */
const FISH_LAYOUTS = {
  // Home: aquarium is about 900px wide, so the fish zig-zag in four evenly spaced columns.
  wide: [
    { fish: "angelfish", x: 165, y: 130, speed: 3.2, delay: 0 },
    { fish: "yellow", x: 385, y: 340, speed: 3.8, delay: -1.2 },
    { fish: "teal", x: 605, y: 130, flip: true, speed: 3.5, delay: -2.1 },
    { fish: "orange", x: 790, y: 340, flip: true, speed: 4, delay: -0.6 },
    { fish: "blue", x: 385, y: 120, speed: 3.4, delay: -2.6 },
    { fish: "brown", x: 588, y: 350, speed: 3.6, delay: -1.8 },
  ],
  // To-do, GPA and Fish shop: aquarium is about 620px wide, so the fish sit in a staggered 2 x 2.
  narrow: [
    { fish: "angelfish", x: 140, y: 110, speed: 3.2, delay: 0 },
    { fish: "teal", x: 450, y: 160, flip: true, speed: 3.5, delay: -2.1 },
    { fish: "yellow", x: 160, y: 285, speed: 3.8, delay: -1.2 },
    { fish: "orange", x: 470, y: 340, flip: true, speed: 4, delay: -0.6 },
    { fish: "blue", x: 300, y: 230, speed: 3.4, delay: -2.6 },
    { fish: "brown", x: 300, y: 470, speed: 3.6, delay: -1.8 },
  ],
};

/* The user's sand dollar balance and the fish in their aquarium, loaded from the backend.
   Until it loads (or if the backend is down) the aquarium shows the starting fish. */
const STARTING_FISH = ["orange"];

function useAquarium() {
  const [aquarium, setAquarium] = useState({ balance: null, owned: STARTING_FISH });
  useEffect(() => {
    api("GET", "/api/aquarium").then(setAquarium).catch(() => {});
  }, []);
  return [aquarium, setAquarium];
}

function AquariumFish({ layout, owned }) {
  const shown = FISH_LAYOUTS[layout].filter(({ fish }) => owned.includes(fish));
  return shown.map(({ fish, x, y, flip, speed, delay }) => {
    const { src, w, h, crop } = FISH[fish];
    return (
      <div key={fish} className="aquarium-fish floating"
        style={{ left: x - w / 2, top: y - h / 2, width: w, height: h,
          animationDuration: speed + "s", animationDelay: delay + "s" }}>
        <div className={"crop fish-crop" + (flip ? " flipped" : "")}>
          <img src={src} alt="" style={crop} />
        </div>
      </div>
    );
  });
}

/* Rising bubbles over the aquarium; the GIFs loop forever and each page sets the water's width.
   The second copy rises through the middle of the water. Its file starts half a loop (about 3s)
   later, so the two sets of bubbles never rise together. */
function Bubbles() {
  return (
    <>
      <div className="crop bubbles">
        <img src="/images/bubbles.gif" alt="" />
      </div>
      <div className="crop bubbles center">
        <img src="/images/bubbles-offset.gif" alt="" />
      </div>
    </>
  );
}

/* ---------- Home ---------- */
function Home() {
  const [{ owned }] = useAquarium();
  return (
    <Layout title="My Aquarium" page="home">
      <div className="crop aquarium">
        <img className="aquarium-img" src="/images/aquarium.png" alt="" />
      </div>

      <div className="abs rock">
        <div className="crop rock-layer">
          <img className="rock-img" src="/images/rock.png" alt="" />
        </div>
        <div className="sidebar menu-sidebar"></div>
        <div className="crop seaweed-right">
          <img className="seaweed-right-img" src="/images/seaweed.png" alt="" />
        </div>

        <h1 className="abs welcome">Welcome to<br />My Aquarium</h1>
        <p className="abs credits by">By:<br />Revati<br />Vaishnavi<br />Valeria<br />Phuong</p>

        <img className="abs row2-tiles" src="/images/menu-buttons-row2.svg" width="291" height="120" alt="" />

        <a className="abs menu-item calendar" href="/calendar">
          <span className="tile"></span>
          <span className="crop icon"><img src="/images/icon-calendar.png" alt="" /></span>
          <span className="label">Calendar</span>
        </a>

        <a className="abs menu-item fish-shop" href="/fish-shop">
          <span className="crop icon"><img src="/images/icon-fish-shop.png" alt="" /></span>
          <span className="label">Fish shop</span>
        </a>

        <div className="crop seaweed-left">
          <img className="seaweed-left-img" src="/images/seaweed-left.gif" alt="" />
        </div>

        <a className="abs menu-item gpa" href="/gpa">
          <span className="crop icon"><img src="/images/icon-gpa.png" alt="" /></span>
          <span className="label small">GPA calculator</span>
        </a>

        <a className="abs menu-item todo" href="/todo">
          <span className="tile"></span>
          <span className="crop icon"><img src="/images/icon-todo.png" alt="" /></span>
          <span className="label">To-do</span>
        </a>

        <p className="abs credits event">For<br />HowdyHack 2026</p>

        <div className="abs seaweed-mid">
          <img className="fill" src="/images/seaweed-mid.gif" alt="" />
        </div>
      </div>

      <AquariumFish layout="wide" owned={owned} />
      <Bubbles />

      <div className="abs rot-7 seaweed-tall">
        <img src="/images/seaweed-tall.gif" alt="" />
      </div>
    </Layout>
  );
}

/* ---------- To-do and GPA share the same look ---------- */
function ListPage({ title, page, heading, listLabel, thing, actions = {}, children }) {
  const [{ owned }] = useAquarium();
  return (
    <Layout title={title} page={"list-page " + page}>
      <div className="crop aquarium">
        <img className="aquarium-img" src="/images/aquarium.png" alt="" />
      </div>

      <div className="abs rock">
        <div className="crop rock-layer">
          <img className="rock-img" src="/images/rock.png" alt="" />
        </div>
        <div className="abs seaweed-mid">
          <img className="fill" src="/images/seaweed-mid.gif" alt="" />
        </div>
      </div>

      <AquariumFish layout="narrow" owned={owned} />
      <Bubbles />

      <div className="sidebar todo-sidebar"></div>
      <HomeLink />

      <div className="abs title-banner">
        <img src="/images/todo-title-banner.svg" width="32" height="32" alt="" />
      </div>
      <h1 className="abs title outlined">{heading}</h1>

      <button className="abs action add" type="button" aria-label={"Add " + thing} onClick={actions.onAdd}>
        <img src="/images/todo-add.png" alt="" />
      </button>
      <button className="abs action edit" type="button" aria-label={"Edit " + thing}
        onClick={actions.onEdit} disabled={actions.noSelection}>
        <img src="/images/todo-edit.png" alt="" />
      </button>
      <button className="abs action delete" type="button" aria-label={"Delete " + thing}
        onClick={actions.onDelete} disabled={actions.noSelection}>
        <img src="/images/todo-delete.png" alt="" />
      </button>
      <button className="abs action clipboard" type="button"
        aria-label={actions.clipboardLabel ?? thing + " details"} title={actions.clipboardLabel}
        onClick={actions.onClipboard}>
        <img src="/images/todo-clipboard.png" alt="" />
      </button>

      <h2 className="abs my-tasks outlined">{listLabel}</h2>

      {children}

      <div className="crop seaweed-right">
        <img className="seaweed-right-img" src="/images/seaweed.png" alt="" />
      </div>
      <div className="crop seaweed-left">
        <img className="seaweed-left-img" src="/images/seaweed-left.gif" alt="" />
      </div>
      <div className="abs rot-7 seaweed-tall">
        <img src="/images/seaweed-tall.gif" alt="" />
      </div>
    </Layout>
  );
}

/* ---------- To-do ---------- */
let nextDraftId = -1; // tasks not yet saved get negative ids until the backend gives them a real one
const emptyTask = () => ({ id: nextDraftId--, name: "", completeBy: "", due: "", daysLeft: null });
const isSaved = (t) => t.id > 0;

// Keep only digits and add the slash for the user: "1031" -> "10/31"
const asMonthDay = (text) => {
  const digits = text.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
};

const describeDaysLeft = (days) => {
  if (days === null) return "";
  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  return days === 1 ? "1 day" : days + " days";
};

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [doneIds, setDoneIds] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api("GET", "/api/tasks")
      .then(setTasks)
      .catch(() => setMessage("Couldn't reach the to-do list server"));
  }, []);

  const replace = (id, task) => setTasks((all) => all.map((t) => (t.id === id ? task : t)));
  const drop = (id) => setTasks((all) => all.filter((t) => t.id !== id));

  // Save the bar being edited. Returns false (and keeps it open) if the backend rejects it.
  const finishEditing = async () => {
    const task = tasks.find((t) => t.id === editingId);
    if (!task) return true;
    if (!isSaved(task) && !task.name && !task.completeBy && !task.due) {
      drop(task.id); // an untouched new bar is simply thrown away
      if (selectedId === task.id) setSelectedId(null);
      setEditingId(null);
      return true;
    }
    try {
      const fields = { name: task.name, completeBy: task.completeBy, due: task.due };
      const saved = isSaved(task)
        ? await api("PUT", `/api/tasks/${task.id}`, fields)
        : await api("POST", "/api/tasks", fields);
      replace(task.id, saved);
      if (selectedId === task.id) setSelectedId(saved.id);
      setEditingId(null);
      setMessage("");
      return true;
    } catch (err) {
      setMessage(err.message === "Failed to fetch" ? "Couldn't reach the to-do list server" : err.message);
      return false;
    }
  };

  const add = async () => {
    if (!(await finishEditing())) return;
    const task = emptyTask();
    setTasks((all) => [...all, task]);
    setSelectedId(task.id);
    setEditingId(task.id);
  };

  const select = async (id) => {
    if (id === editingId || !(await finishEditing())) return;
    setSelectedId(id);
  };

  const edit = async () => {
    if (editingId === selectedId) return finishEditing();
    if (await finishEditing()) setEditingId(selectedId);
  };

  const remove = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return false;
    try {
      if (isSaved(task)) await api("DELETE", `/api/tasks/${id}`);
    } catch {
      setMessage("Couldn't reach the to-do list server");
      return false;
    }
    drop(id);
    if (selectedId === id) setSelectedId(null);
    if (editingId === id) setEditingId(null);
    setMessage("");
    return true;
  };

  // Checking a task off shows a tick, then the bar fades out and is removed, and the backend
  // pays the sand dollar reward. A bar that was never saved is saved first so it counts.
  const checkOff = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    if (!isSaved(task) && !task.name.trim()) {
      setMessage("Give the task a name before checking it off");
      return;
    }
    setDoneIds((ids) => [...ids, id]);
    setTimeout(async () => {
      try {
        const fields = { name: task.name, completeBy: task.completeBy, due: task.due };
        const savedId = isSaved(task) ? id : (await api("POST", "/api/tasks", fields)).id;
        const { balance } = await api("POST", `/api/tasks/${savedId}/complete`);
        drop(id);
        if (selectedId === id) setSelectedId(null);
        if (editingId === id) setEditingId(null);
        setMessage(`+5 sand dollars! You have ${balance} now.`);
      } catch (err) {
        setDoneIds((ids) => ids.filter((d) => d !== id));
        setMessage(err.message === "Failed to fetch" ? "Couldn't reach the to-do list server" : err.message);
      }
    }, 600);
  };

  const update = (id, key, value) => replace(id, { ...tasks.find((t) => t.id === id), [key]: value });

  const actions = {
    onAdd: add,
    onEdit: edit,
    onDelete: () => remove(selectedId),
    noSelection: selectedId === null,
  };

  return (
    <ListPage title="To-do List" page="todo-page" heading="TO-DO LIST" listLabel="My tasks:" thing="task"
      actions={actions}>
      {message && <p className="abs list-message">{message}</p>}
      <ol className="abs entry-list">
        {tasks.length === 0 && <li className="empty-hint">Press + to add a task</li>}
        {tasks.map((t, i) => {
          const editing = t.id === editingId;
          const field = (key, placeholder, numeric) =>
            editing ? (
              <input
                value={t[key]}
                placeholder={placeholder}
                inputMode={numeric ? "numeric" : undefined}
                autoFocus={key === "name"}
                onChange={(e) => update(t.id, key, numeric ? asMonthDay(e.target.value) : e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && finishEditing()}
              />
            ) : (
              <span className="value">{t[key]}</span>
            );
          return (
            <li
              key={t.id}
              className={"task" + (t.id === selectedId ? " selected" : "") + (editing ? " editing" : "")
                + (doneIds.includes(t.id) ? " done" : "")}
              tabIndex={0}
              aria-selected={t.id === selectedId}
              onClick={() => select(t.id)}
              onKeyDown={(e) => {
                if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  select(t.id);
                }
              }}
            >
              <span className="badge">{i + 1}</span>
              <label className="field name">{field("name", "Task name")}</label>
              <label className="field complete-by">Complete by: {field("completeBy", "MM/DD", true)}</label>
              <span className="field days-left">
                | Days left:{" "}
                <span className={"value" + (t.daysLeft < 0 ? " overdue" : "")}>{describeDaysLeft(t.daysLeft)}</span>
              </span>
              <label className="field due">| Due: {field("due", "MM/DD", true)}</label>
              <button
                className="check"
                type="button"
                aria-label={"Check off " + (t.name || "task")}
                onClick={(e) => {
                  e.stopPropagation();
                  checkOff(t.id);
                }}
              >
                <img src="/images/todo-check.svg" width="50" height="50" alt="" />
              </button>
            </li>
          );
        })}
      </ol>
    </ListPage>
  );
}

/* ---------- GPA ---------- */
const GRADES = ["A", "B", "C", "D", "F"];

let nextClassId = 1;
const emptyClass = () => ({ id: nextClassId++, subject: "", grade: "", hours: "" });

const countsTowardGpa = (c) => GRADES.includes(c.grade) && Number(c.hours) > 0;

function Gpa() {
  const [classes, setClasses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [gpa, setGpa] = useState(null);
  const [message, setMessage] = useState("");

  // Any change to the list makes the last GPA out of date, so hide it until "calculate" is pressed again.
  const changeClasses = (next) => {
    setClasses(next);
    setGpa(null);
    setMessage("");
  };

  const add = () => {
    const c = emptyClass();
    changeClasses([...classes, c]);
    setSelectedId(c.id);
    setEditingId(c.id);
  };

  const select = (id) => {
    setSelectedId(id);
    if (editingId !== id) setEditingId(null);
  };

  const edit = () => setEditingId(editingId === selectedId ? null : selectedId);

  const remove = () => {
    changeClasses(classes.filter((c) => c.id !== selectedId));
    setSelectedId(null);
    setEditingId(null);
  };

  const update = (id, key, value) =>
    changeClasses(classes.map((c) => (c.id === id ? { ...c, [key]: value } : c)));

  // Send the classes to the backend and show the GPA it calculates.
  const calculate = async () => {
    setEditingId(null);
    if (classes.length === 0) return setMessage("Press + to add a class first");
    const missing = classes.findIndex((c) => !countsTowardGpa(c));
    if (missing !== -1) return setMessage(`Class ${missing + 1} needs a grade and credit hours`);

    try {
      const res = await fetch("/api/gpa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classes: classes.map((c) => ({ ...c, hours: Number(c.hours) })) }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      setGpa(body.gpa);
      setMessage("");
    } catch {
      setMessage("Couldn't reach the GPA calculator");
    }
  };

  const heading = (
    <>
      GPA : <span className="gpa-value">{gpa ?? "-"}</span>
    </>
  );

  const actions = {
    onAdd: add,
    onEdit: edit,
    onDelete: remove,
    onClipboard: calculate,
    noSelection: selectedId === null,
    clipboardLabel: "Calculate GPA",
  };

  return (
    <ListPage title="GPA Calculator" page="gpa-page" heading={heading} listLabel="classes:" thing="class"
      actions={actions}>
      {message && <p className="abs list-message">{message}</p>}
      <ol className="abs entry-list">
        {classes.length === 0 && <li className="empty-hint">Press + to add a class</li>}
        {classes.map((c, i) => {
          const editing = c.id === editingId;
          return (
            <li
              key={c.id}
              className={"task" + (c.id === selectedId ? " selected" : "") + (editing ? " editing" : "")}
              tabIndex={0}
              aria-selected={c.id === selectedId}
              onClick={() => select(c.id)}
              onKeyDown={(e) => {
                if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  select(c.id);
                }
              }}
            >
              <span className="badge">{i + 1}</span>
              <label className="field name">
                Subject:
                {editing ? (
                  <input autoFocus value={c.subject} onChange={(e) => update(c.id, "subject", e.target.value)} />
                ) : (
                  <span className="value">{c.subject}</span>
                )}
              </label>
              <label className="field complete-by">
                Grade:
                {editing ? (
                  <select value={c.grade} onChange={(e) => update(c.id, "grade", e.target.value)}>
                    <option value="">-</option>
                    {GRADES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                ) : (
                  <span className="value">{c.grade}</span>
                )}
              </label>
              <label className="field days-left">
                | Credit hours:
                {editing ? (
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={c.hours}
                    onChange={(e) => update(c.id, "hours", e.target.value)}
                  />
                ) : (
                  <span className="value">{c.hours}</span>
                )}
              </label>
            </li>
          );
        })}
      </ol>
    </ListPage>
  );
}

/* ---------- Fish shop ---------- */
const items = [
  { x: 712, y: 182, price: "price 10", priceX: 764, priceY: 336, coinX: 841, coinY: 328,
    fish: { src: "/images/fish-teal.png", name: "Teal fish", id: "teal", cost: 10, x: 691, y: 178, w: 219, h: 219,
      crop: { left: "0", top: "0", width: "100%", height: "100%" } } },
  { x: 1012, y: 182, price: "price 20", priceX: 1049, priceY: 338, coinX: 1132, coinY: 328,
    fish: { src: "/images/fish-brown.png", name: "Brown fish", id: "brown", cost: 20, x: 1010, y: 212, w: 224, h: 76,
      crop: { left: "0", top: "-194.25%", width: "100%", height: "294.25%" } } },
  { x: 712, y: 393, price: "price 1000", priceX: 745, priceY: 553, coinX: 854, coinY: 542,
    fish: { src: "/images/fish-yellow.png", name: "Yellow fish", id: "yellow", cost: 1000, x: 691, y: 397, w: 198, h: 143,
      crop: { left: "-85.51%", top: "0", width: "185.51%", height: "256.86%" } } },
  { x: 1012, y: 393, price: "price  30", priceX: 1059, priceY: 552, coinX: 1155, coinY: 545,
    fish: { src: "/images/fish-blue.png", name: "Blue fish", id: "blue", cost: 30, x: 1022, y: 395, w: 199, h: 147,
      crop: { left: "-3.18%", top: "-3.23%", width: "152.68%", height: "207.01%" } } },
  { x: 712, y: 604, price: "price 25", priceX: 757, priceY: 757, coinX: 839, coinY: 748,
    fish: { src: "/images/fish-orange.png", name: "Orange fish", id: "orange", cost: 25, x: 714, y: 597, w: 196, h: 141,
      crop: { left: "0", top: "-39.22%", width: "100%", height: "139.22%" } } },
  { x: 1012, y: 604, price: "price 100", priceX: 1049, priceY: 760, coinX: 1145, coinY: 750,
    fish: { src: "/images/home-angelfish.png", name: "Angelfish", id: "angelfish", cost: 100, x: 981, y: 569, w: 229, h: 216, flip: true,
      crop: { left: "0", top: "0", width: "100%", height: "100%", objectFit: "cover" } } },
];

function FishShop() {
  const [{ balance, owned }, setAquarium] = useAquarium();
  const [message, setMessage] = useState("");

  // Buying deducts the price and adds the fish to the aquarium; fish already there can't be bought.
  const buy = async ({ id, name, cost }) => {
    if (owned.includes(id)) return setMessage(`The ${name.toLowerCase()} is already in your aquarium`);
    try {
      setAquarium(await api("POST", "/api/shop/buy", { fish: id }));
      setMessage(`You bought the ${name.toLowerCase()} for ${cost} sand dollars!`);
    } catch (err) {
      setMessage(err.message === "Failed to fetch" ? "Couldn't reach the shop server" : err.message);
    }
  };

  return (
    <Layout title="Fish Shop" page="shop">
      <div className="crop aquarium">
        <img className="aquarium-img" src="/images/aquarium.png" alt="" />
      </div>
      <div className="abs aquarium-clip">
        <div className="abs rock">
          <div className="crop rock-layer">
            <img className="rock-img" src="/images/rock.png" alt="" />
          </div>
          <div className="abs seaweed-mid">
            <img className="fill" src="/images/seaweed-mid.gif" alt="" />
          </div>
        </div>
      </div>

      <AquariumFish layout="narrow" owned={owned} />
      <Bubbles />

      <div className="sidebar shop-sidebar"></div>
      <HomeLink />

      <h1 className="abs title">FISH SHOP</h1>

      <div className="abs balance-bar"></div>
      <p className="abs balance-label">MY BALANCE</p>
      <img className="abs sand-dollar" src="/images/sand-dollar.png" alt="Sand dollars" />
      <p className="abs balance-amount" aria-live="polite">{balance ?? "-"}</p>

      <div className="abs panel"></div>
      <ul className="shop-items">
        {items.map((item, i) => (
          <li key={i}>
            <button
              className={"abs card" + (owned.includes(item.fish.id) ? " owned" : "")}
              type="button"
              style={{ left: item.x, top: item.y }}
              aria-label={owned.includes(item.fish.id)
                ? `${item.fish.name}, already in your aquarium`
                : `Buy the ${item.fish.name.toLowerCase()} for ${item.fish.cost} sand dollars`}
              onClick={() => buy(item.fish)}
            >
              {owned.includes(item.fish.id) && <span className="owned-tag">In aquarium</span>}
            </button>
            <p className="abs price" style={{ left: item.priceX, top: item.priceY }}>
              {item.price}
            </p>
            <img className="abs coin" src="/images/sand-dollar.png" alt="sand dollars"
              style={{ left: item.coinX, top: item.coinY }} />
            <div className="crop fish"
              style={{ left: item.fish.x, top: item.fish.y, width: item.fish.w, height: item.fish.h,
                transform: item.fish.flip ? "scaleX(-1)" : undefined }}>
              <img src={item.fish.src} alt="" style={item.fish.crop} />
            </div>
          </li>
        ))}
      </ul>
      {message && <p className="abs shop-message" aria-live="polite">{message}</p>}

      <div className="abs rot-7 seaweed-tall">
        <img src="/images/seaweed-tall.gif" alt="" />
      </div>

      <div className="frame-border"></div>
    </Layout>
  );
}

/* ---------- Calendar ---------- */
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Entry colours from the design (must match COLORS in src/backend/calendar.js); navy uses white text
const ENTRY_COLORS = [
  { value: "#f71266", name: "Pink" },
  { value: "#4dc8c0", name: "Teal" },
  { value: "#1b6fed", name: "Blue" },
  { value: "#f9ffc3", name: "Light yellow" },
  { value: "#f5df86", name: "Gold" },
  { value: "#202256", name: "Navy" },
];
const isDark = (color) => color === "#202256";

// "10/31" reads as "Due 10/31"; a time such as "11:59 pm" reads as "Due at 11:59 pm"
const dueLabel = (due) => (/^\d{1,2}\/\d{1,2}$/.test(due) ? "Due " + due : "Due at " + due);

/* Pop-up form for adding or editing an entry */
function EntryForm({ entry, onSave, onCancel }) {
  const [fields, setFields] = useState(entry);
  const set = (key, value) => setFields((f) => ({ ...f, [key]: value }));

  return (
    <div className="abs form-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <form
        className="entry-form"
        role="dialog"
        aria-labelledby="entry-form-title"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(fields);
        }}
        onKeyDown={(e) => e.key === "Escape" && onCancel()}
      >
        <h2 id="entry-form-title">{entry.id ? "Edit entry" : "New entry"}</h2>
        <label>
          Task name
          <input autoFocus value={fields.title} maxLength={60} onChange={(e) => set("title", e.target.value)} />
        </label>
        <label>
          Day
          <select value={fields.day} onChange={(e) => set("day", Number(e.target.value))}>
            {DAYS.map((d, i) => (
              <option key={d} value={i}>{d}</option>
            ))}
          </select>
        </label>
        <label>
          Due <span className="optional">(optional)</span>
          <input
            value={fields.due}
            maxLength={20}
            placeholder="e.g. 11:59 pm or 10/31"
            onChange={(e) => set("due", e.target.value)}
          />
        </label>
        <fieldset>
          <legend>Colour</legend>
          {ENTRY_COLORS.map((c) => (
            <label key={c.value} className="swatch" title={c.name}>
              <input
                type="radio"
                name="color"
                value={c.value}
                checked={fields.color === c.value}
                onChange={() => set("color", c.value)}
                aria-label={c.name}
              />
              <span style={{ background: c.value }} />
            </label>
          ))}
        </fieldset>
        <div className="form-buttons">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit" className="primary">Save</button>
        </div>
      </form>
    </div>
  );
}

function Calendar() {
  const [entries, setEntries] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(null); // the entry being added or edited, or null
  const [dragOverDay, setDragOverDay] = useState(null);
  const [message, setMessage] = useState("");

  const fail = (err) =>
    setMessage(err.message === "Failed to fetch" ? "Couldn't reach the calendar server" : err.message);

  const reload = () => api("GET", "/api/calendar").then(setEntries).catch(fail);
  useEffect(() => {
    reload();
  }, []);

  const selected = entries.find((e) => e.id === selectedId);

  const add = () => {
    // New entries go on the selected entry's day, or Monday, and take the next colour in turn
    const color = ENTRY_COLORS[entries.length % ENTRY_COLORS.length].value;
    setForm({ title: "", day: selected?.day ?? 0, due: "", color });
  };

  const save = async (fields) => {
    try {
      const body = { title: fields.title, day: fields.day, due: fields.due, color: fields.color };
      if (fields.id) {
        const saved = await api("PUT", `/api/calendar/${fields.id}`, body);
        // a change of day moves the entry to the bottom of its new day, so reload to get the order right
        if (saved.day !== entries.find((e) => e.id === saved.id)?.day) await reload();
        else setEntries((all) => all.map((e) => (e.id === saved.id ? saved : e)));
      } else {
        const saved = await api("POST", "/api/calendar", body);
        setEntries((all) => [...all, saved]);
        setSelectedId(saved.id);
      }
      setForm(null);
      setMessage("");
    } catch (err) {
      fail(err);
    }
  };

  const remove = async () => {
    if (!selected) return;
    try {
      await api("DELETE", `/api/calendar/${selected.id}`);
      setEntries((all) => all.filter((e) => e.id !== selected.id));
      setSelectedId(null);
      setMessage(`Deleted "${selected.title}"`);
    } catch (err) {
      fail(err);
    }
  };

  const moveTo = async (id, day) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry || entry.day === day) return;
    // show the move straight away (at the bottom of the new day), then save it
    setEntries((all) => [...all.filter((e) => e.id !== id), { ...entry, day }]);
    setSelectedId(id);
    try {
      await api("PUT", `/api/calendar/${id}`, { day });
      setMessage(`Moved "${entry.title}" to ${DAYS[day]}`);
    } catch (err) {
      fail(err);
      reload();
    }
  };

  return (
    <Layout title="Calendar" page="calendar-page">
      <div className="crop aquarium">
        <img className="aquarium-img" src="/images/aquarium.png" alt="" />
      </div>
      <div className="abs rock">
        <div className="crop rock-layer">
          <img className="rock-img" src="/images/rock.png" alt="" />
        </div>
        <div className="abs seaweed-mid">
          <img className="fill" src="/images/seaweed-mid.gif" alt="" />
        </div>
      </div>
      <div className="abs rot-7 seaweed-tall">
        <img src="/images/seaweed-tall.gif" alt="" />
      </div>

      <Bubbles />

      <div className="sidebar calendar-sidebar"></div>

      <div className="abs title-banner">
        <img src="/images/todo-title-banner.svg" width="32" height="32" alt="" />
      </div>
      <HomeLink />
      <h1 className="abs title">CALENDAR</h1>
      <button className="abs action add-event" type="button" aria-label="Add entry" onClick={add}>
        <img src="/images/todo-add.png" alt="" />
      </button>
      <button className="abs action edit-event" type="button" aria-label="Edit selected entry"
        disabled={!selected} onClick={() => setForm({ ...selected })}>
        <img src="/images/todo-edit.png" alt="" />
      </button>
      <button className="abs action delete-event" type="button" aria-label="Delete selected entry"
        disabled={!selected} onClick={remove}>
        <img src="/images/todo-delete.png" alt="" />
      </button>

      <ol className="abs week">
        {DAYS.map((day, dayIndex) => (
          <li key={day} className="day">
            <h2 className="day-name">{day}</h2>
            <ul
              className={"day-column" + (dragOverDay === dayIndex ? " drag-over" : "")}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setDragOverDay(dayIndex);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setDragOverDay(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverDay(null);
                moveTo(Number(e.dataTransfer.getData("text/plain")), dayIndex);
              }}
            >
              {entries.filter((e) => e.day === dayIndex).map((entry) => (
                <li
                  key={entry.id}
                  className={"event" + (isDark(entry.color) ? " light" : "") + (entry.id === selectedId ? " selected" : "")}
                  style={{ background: entry.color }}
                  draggable
                  tabIndex={0}
                  aria-selected={entry.id === selectedId}
                  onClick={() => setSelectedId(entry.id)}
                  onDoubleClick={() => setForm({ ...entry })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedId(entry.id);
                    }
                  }}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", String(entry.id));
                    e.dataTransfer.effectAllowed = "move";
                    setSelectedId(entry.id);
                  }}
                  onDragEnd={() => setDragOverDay(null)}
                >
                  <span className="event-title">{entry.title}</span>
                  {entry.due && <span className="event-due">{dueLabel(entry.due)}</span>}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {message && <p className="abs calendar-message" aria-live="polite">{message}</p>}

      <div className="crop seaweed-left">
        <img className="seaweed-left-img" src="/images/seaweed-left.gif" alt="" />
      </div>

      {form && <EntryForm entry={form} onSave={save} onCancel={() => setForm(null)} />}
    </Layout>
  );
}

/* ---------- Pick the page from the address bar ---------- */
export default function App() {
  const path = window.location.pathname;
  if (path === "/todo") return <Todo />;
  if (path === "/gpa") return <Gpa />;
  if (path === "/fish-shop") return <FishShop />;
  if (path === "/calendar") return <Calendar />;
  return <Home />;
}
