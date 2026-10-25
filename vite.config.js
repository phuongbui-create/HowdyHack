import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// React frontend lives in src/frontend; /api requests go to the Node backend (src/backend).
export default defineConfig({
  root: "src/frontend",
  publicDir: "../../public",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": "http://localhost:3001" },
  },
  build: { outDir: "../../dist-react", emptyOutDir: true },
});
