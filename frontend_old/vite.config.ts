import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
  plugins: [react()],
  root: "./", // Ensure Vite starts from the frontend folder
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Ensures absolute path resolution
    },
  },
  server: {
    port: 5173, // Change if needed
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
