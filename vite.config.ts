import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import {Config} from "./src/model/Config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build:{
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        adminClass: fileURLToPath(new URL('./admin-class.html', import.meta.url))
      }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: Config.AUTH_SERVICE_HOST,
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
