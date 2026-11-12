import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev, /api calls are proxied to the Express server, so no CORS setup is needed.
// 127.0.0.1 (not "localhost") avoids IPv6 lookup problems that cause failed/404 API calls.
// If you change PORT in server/.env, change it here too.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": { target: "http://127.0.0.1:5000", changeOrigin: true } },
  },
});
