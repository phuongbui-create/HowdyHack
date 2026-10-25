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
};

/* Where each fish sits (its centre point), which way it faces, and its bobbing rhythm.
   Fish on the left face right and fish on the right face left, so pairs face each other. */
const FISH_LAYOUTS = {
  // Home: aquarium is about 900px wide, so the fish zig-zag in four evenly spaced columns.
  wide: [
    { fish: "angelfish", x: 165, y: 130, speed: 3.2, delay: 0 },
    { fish: "yellow", x: 385, y: 340, speed: 3.8, delay: -1.2 },
    { fish: "teal", x: 605, y: 130, flip: true, speed: 3.5, delay: -2.1 },
    { fish: "orange", x: 790, y: 340, flip: true, speed: 4, delay: -0.6 },
  ],
  // To-do, GPA and Fish shop: aquarium is about 620px wide, so the fish sit in a staggered 2 x 2.
  narrow: [
    { fish: "angelfish", x: 140, y: 110, speed: 3.2, delay: 0 },
    { fish: "teal", x: 450, y: 160, flip: true, speed: 3.5, delay: -2.1 },
    { fish: "yellow", x: 160, y: 285, speed: 3.8, delay: -1.2 },
    { fish: "orange", x: 470, y: 340, flip: true, speed: 4, delay: -0.6 },
  ],
};

function AquariumFish({ layout }) {
  return FISH_LAYOUTS[layout].map(({ fish, x, y, flip, speed, delay }) => {
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

/* ---------- Home ---------- */
function Home() {
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

      <AquariumFish layout="wide" />

      <div className="abs rot-7 seaweed-tall">
        <img src="/images/seaweed-tall.gif" alt="" />
      </div>
    </Layout>
  );
}

/* ---------- To-do and GPA share the same look ---------- */
function ListPage({ title, page, heading, listLabel, thing, actions = {}, children }) {
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

      <AquariumFish layout="narrow" />

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

  // Checking a task off shows a tick, then the bar fades out and is removed.
  const checkOff = (id) => {
    setDoneIds((ids) => [...ids, id]);
    setTimeout(async () => {
      if (!(await remove(id))) setDoneIds((ids) => ids.filter((d) => d !== id));
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
  { x: 713, y: 183, price: "price 10", priceX: 765, priceY: 337, coinX: 842, coinY: 329,
    fish: { src: "/images/fish-teal.png", name: "Teal fish", x: 691, y: 178, w: 219, h: 219,
      crop: { left: "0", top: "0", width: "100%", height: "100%" } } },
  { x: 1013, y: 183, price: "price 20", priceX: 1050, priceY: 339, coinX: 1133, coinY: 329,
    fish: { src: "/images/fish-brown.png", name: "Brown fish", x: 1010, y: 212, w: 224, h: 76,
      crop: { left: "0", top: "-194.25%", width: "100%", height: "294.25%" } } },
  { x: 713, y: 394, price: "price 1000", priceX: 745, priceY: 554, coinX: 855, coinY: 543,
    fish: { src: "/images/fish-yellow.png", name: "Yellow fish", x: 691, y: 397, w: 198, h: 143,
      crop: { left: "-85.51%", top: "0", width: "185.51%", height: "256.86%" } } },
  { x: 1013, y: 394, price: "price  30", priceX: 1060, priceY: 553, coinX: 1156, coinY: 546,
    fish: { src: "/images/fish-blue.png", name: "Blue fish", x: 1022, y: 395, w: 199, h: 147,
      crop: { left: "-3.18%", top: "-3.23%", width: "152.68%", height: "207.01%" } } },
  { x: 713, y: 605, price: "price 25", priceX: 758, priceY: 753, coinX: 839, coinY: 748,
    fish: { src: "/images/fish-orange.png", name: "Orange fish", x: 714, y: 597, w: 196, h: 141,
      crop: { left: "0", top: "-39.22%", width: "100%", height: "139.22%" } } },
  { x: 1013, y: 605, price: "price ", priceX: 1076, priceY: 757, coinX: 1132, coinY: 751 },
];

function FishShop() {
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

      <AquariumFish layout="narrow" />

      <div className="sidebar shop-sidebar"></div>
      <HomeLink />

      <h1 className="abs title">FISH SHOP</h1>

      <div className="abs balance-bar"></div>
      <p className="abs balance-label">MY BALANCE</p>
      <img className="abs sand-dollar" src="/images/sand-dollar.png" alt="Sand dollar" />

      <div className="abs panel"></div>
      <ul className="shop-items">
        {items.map((item, i) => (
          <li key={i}>
            <div className="abs card" style={{ left: item.x, top: item.y }} />
            <p className="abs price" style={{ left: item.priceX, top: item.priceY }}>
              {item.price}
            </p>
            <img className="abs coin" src="/images/sand-dollar.png" alt="sand dollars"
              style={{ left: item.coinX, top: item.coinY }} />
            {item.fish && (
              <div className="crop fish"
                style={{ left: item.fish.x, top: item.fish.y, width: item.fish.w, height: item.fish.h }}>
                <img src={item.fish.src} alt={item.fish.name} style={item.fish.crop} />
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="abs rot-7 seaweed-tall">
        <img src="/images/seaweed-tall.gif" alt="" />
      </div>

      <div className="frame-border"></div>
    </Layout>
  );
}

/* ---------- Calendar ---------- */
const week = [
  { day: "Monday", events: [
    { lines: ["MATH 151 HW", "Due at 11:59 pm"], color: "#f71266" },
    { lines: ["Post lab", "Due at 5:00 pm"], color: "#4dc8c0" },
    { lines: ["Robotics team", "meeting"], color: "#202256", light: true },
  ] },
  { day: "Tuesday", events: [
    { lines: ["Career fair"], color: "#202256", light: true },
    { lines: ["ENGR 102 HW", "Due at 11:59 pm"], color: "#1b6fed" },
    { lines: ["CHEM 107 HW", "Due at 11:59 pm"], color: "#f9ffc3" },
  ] },
  { day: "Wednesday", events: [
    { lines: ["MATH LAB", "Due at 2:00 pm"], color: "#f71266" },
    { lines: ["Social event"], color: "#202256", light: true },
  ] },
  { day: "Thursday", events: [
    { lines: ["Study for POLS", "207"], color: "#f5df86" },
    { lines: ["CHEM 107 HW", "Due at 3:00 pm"], color: "#f9ffc3" },
  ] },
  { day: "Friday", events: [
    { lines: ["Club Meeting"], color: "#202256", light: true },
  ] },
  { day: "Saturday", events: [
    { lines: ["CHEM 107 HW", "Due at 3:00 pm"], color: "#f9ffc3" },
  ] },
  { day: "Sunday", events: [
    { lines: ["Study for Math 151"], color: "#f71266" },
  ] },
];

function Calendar() {
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

      <div className="sidebar calendar-sidebar"></div>

      <div className="abs title-banner">
        <img src="/images/todo-title-banner.svg" width="32" height="32" alt="" />
      </div>
      <HomeLink />
      <h1 className="abs title">CALENDAR</h1>
      <button className="abs add-event" type="button" aria-label="Add event">
        <img src="/images/todo-add.png" alt="" />
      </button>

      <ol className="abs week">
        {week.map(({ day, events }) => (
          <li key={day} className="day">
            <h2 className="day-name">{day}</h2>
            <ul className="day-column">
              {events.map((e, i) => (
                <li key={i} className={"event" + (e.light ? " light" : "")} style={{ background: e.color }}>
                  {e.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="crop seaweed-left">
        <img className="seaweed-left-img" src="/images/seaweed-left.gif" alt="" />
      </div>
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
