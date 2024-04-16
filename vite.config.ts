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
        paymentsView: fileURLToPath(new URL('./payments-view.html', import.meta.url)),        
        hackSquarespaceMenu : fileURLToPath(new URL('./src/utils/hack-squarespace-menu.ts', import.meta.url)),
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
