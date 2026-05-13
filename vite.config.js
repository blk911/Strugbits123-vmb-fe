import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import { credentialAssistApiMiddleware } from "./src/pages/api/deep-dig/credential-assist.js";

function credentialAssistDevPlugin() {
  return {
    name: "credential-assist-api",
    configureServer(server) {
      server.middlewares.use(credentialAssistApiMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(credentialAssistApiMiddleware);
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({ exportAsDefault: true }),
    credentialAssistDevPlugin(),
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
