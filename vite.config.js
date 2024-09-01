import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Default output directory
    sourcemap: true, // Generate source maps for debugging
  },
  // If your app is served from a subdirectory on the domain, set the base path
  base: "/", // Default is '/' (root of domain)
});
