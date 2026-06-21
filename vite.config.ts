import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Rutas relativas: la app funciona en la subruta de GitHub Pages
  // (p. ej. /podcast-diario-IA/) sin depender del nombre exacto del repo.
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
