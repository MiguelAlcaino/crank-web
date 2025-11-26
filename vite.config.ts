import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default ({mode}) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    define:{
      "process.env": env,
      // Vue feature flags
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    },
    plugins: [vue()],
    build:{
      lib:{
        entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        name: 'crank-web',
        fileName: 'crank-web',
        formats: ['es'],
      },
      rollupOptions: {}
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: true
    }
  })
};
