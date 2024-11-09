import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Listen on all addresses, not just localhost
    port: 5173, // Ensure it's running on the desired port
    strictPort: true // If port 5173 is not available, fail instead of trying a different port
  }
})
