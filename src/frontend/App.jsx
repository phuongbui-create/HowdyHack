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

        <a className="abs menu-item todo" href="/todo">
          <span className="tile"></span>
          <span className="label">To-do</span>
        </a>

        <img className="abs row2-tiles" src="/images/menu-buttons-row2.svg" width="291" height="120" alt="" />

        <div className="abs menu-item calendar">
          <span className="tile"></span>
          <span className="label">Calendar</span>
        </div>

        <a className="abs menu-item fish-shop" href="/fish-shop">
          <span className="label">Fish shop</span>
        </a>

        <div className="crop seaweed-left">
          <img className="seaweed-left-img" src="/images/seaweed-left.gif" alt="" />
        </div>

        <a className="abs menu-item gpa" href="/gpa">
          <span className="label small">GPA calculator</span>
        </a>

        <div className="abs seaweed-mid">
          <img className="fill" src="/images/seaweed-mid.gif" alt="" />
        </div>
      </div>

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

      <div className="sidebar todo-sidebar"></div>

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

function Todo() {
  return (
    <ListPage title="To-do List" page="todo-page" heading="TO-DO LIST" listLabel="My tasks:" thing="task">
      <article className="abs task">
        <span className="badge">1</span>
        <span className="field name">Task name</span>
        <span className="field complete-by">Complete by:</span>
        <span className="field days-left">| Days left:</span>
        <span className="field due">| Due:</span>
      </article>
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
      {message && <p className="abs gpa-message">{message}</p>}
      <ol className="abs class-list">
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

      <div className="sidebar shop-sidebar"></div>

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

/* ---------- Pick the page from the address bar ---------- */
export default function App() {
  const path = window.location.pathname;
  if (path === "/todo") return <Todo />;
  if (path === "/gpa") return <Gpa />;
  if (path === "/fish-shop") return <FishShop />;
  return <Home />;
}
