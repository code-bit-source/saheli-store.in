import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "/",   // ✅ ye line bahut important hai
  plugins: [tailwindcss(), react()],
  build: {
    outDir: "dist"
  }
})
