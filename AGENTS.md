## Project

A React + Vite website (`src/frontend`) with a small Node backend (`src/backend`).
Images and GIFs live in `public/images`. The backend saves user data to `data/` (git-ignored).

## Development

Run both servers, each in its own terminal (or in background mode):

```
npm run backend   # API on http://localhost:3001 (restarts when backend files change)
npm run dev       # website on http://localhost:5173 (forwards /api to the backend)
```

`npm run build` builds the site into `dist-react/`; `npm run preview` serves that build on port 4173.

## Code layout

- `src/frontend/App.jsx`: every page (home, to-do, GPA, fish shop, calendar); the page is picked from the URL path
- `src/frontend/App.css`: all styles; each page is a fixed 1280x832 canvas scaled to fit the window
- `src/backend/index.js`: HTTP routes (the list of endpoints is at the top of the file)
- `src/backend/*.js`: GPA maths, to-do tasks, calendar entries, sand dollars and owned fish

## Documentation

- React: https://react.dev
- Vite: https://vite.dev/guide/
