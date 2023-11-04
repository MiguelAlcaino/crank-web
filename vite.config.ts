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
        adminClass: fileURLToPath(new URL('./admin-class.html', import.meta.url)),
        roomLAyoutCreate: fileURLToPath(new URL('./room-layout-create.html', import.meta.url)),
        roomLayoutEdit: fileURLToPath(new URL('./room-layout-edit.html', import.meta.url)),
        adminClassView: fileURLToPath(new URL('./admin-class-view.html', import.meta.url)),
      },
      output: {
				entryFileNames: 'app-[name].js',
				assetFileNames: 'app-[name].css',
				chunkFileNames: "chunk-[name].js",
				manualChunks: undefined,
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
