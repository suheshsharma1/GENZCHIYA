import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,   // bind to 0.0.0.0 — makes the dev server reachable from phones on the same WiFi
    port: 5173,
  },
})

