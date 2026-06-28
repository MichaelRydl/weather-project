/* eslint-env node */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import basicSsl from "@vitejs/plugin-basic-ssl";

// Geolocation only works in a secure context (HTTPS or localhost). When testing
// from a phone over the LAN IP you need HTTPS, so enable it with `HTTPS=true`
// (see the `dev:mobile` script). Plain `npm run dev` stays on HTTP/localhost.
const useHttps = process.env.HTTPS === "true";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        // svgr options
      },
    }),
    ...(useHttps ? [basicSsl()] : []),
  ],
  server: {
    // Expose on the local network so phones/tablets can open the dev server.
    host: true,
  },
});
