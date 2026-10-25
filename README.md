# My Aquarium

A cozy study companion made for HowdyHack 2026 by Revati, Vaishnavi, Valeria and Phuong.

Keep track of your classes and tasks, and grow an aquarium as you get work done.
**Fun fact: All assets and background are hand-drawn!**

- **To-do list**: add tasks with a "complete by" and "due" date (MM/DD); check a task off to earn 5 sand dollars
- **Calendar**: a weekly view; add, edit, delete and drag entries between days
- **GPA calculator**: enter each class's letter grade and credit hours, then calculate your GPA the Texas A&M way
- **Fish shop**: spend sand dollars on new fish; every fish you buy swims in the aquarium on every page

## Running it

You need [Node.js](https://nodejs.org) 22 or newer.

```sh
npm install
```

Then start the two parts, each in its own terminal:

```sh
npm run backend   # saves your tasks, calendar, sand dollars and fish (port 3001)
npm run dev       # the website
```

Open http://localhost:5173.

## Commands

| Command           | What it does                                              |
| :---------------- | :-------------------------------------------------------- |
| `npm run dev`     | Starts the website at `localhost:5173`                    |
| `npm run backend` | Starts the backend at `localhost:3001`                    |
| `npm run build`   | Builds the website into `dist-react/`                     |
| `npm run preview` | Serves the built website at `localhost:4173`              |

## Project structure

```text
public/images/     artwork, icons and animated GIFs
src/frontend/      the React app (App.jsx has every page, App.css every style)
src/backend/       the Node backend (index.js lists every API route)
data/              your saved data, created by the backend (not committed)
```

## Sharing a demo link

With both servers running, build and preview the site, then open a Cloudflare quick tunnel:

```sh
npm run build
npm run preview
npx cloudflared tunnel --url http://localhost:4173
```

The last command prints a public `https://….trycloudflare.com` link that works while your computer and all three commands are running. Anyone with the link uses your saved data.
