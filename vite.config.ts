import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@context-providers': path.resolve(__dirname, './src/components/context-providers'),
      '@store': path.resolve(__dirname, './src/store'),
    },
  },
  build: {
    lib: {
      entry: {
        'fwc-dashboard': "src/main.tsx",
      },
      name: "fwcDashboard",
      // TODO: multiple entry points are not supported with umd
      // How do we add umd support then?
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  plugins: [react(), dts()],
});
