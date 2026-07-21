import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Local dev: /api istekleri localhost backend'e yönlendirilir
      '/api': {
        target: 'http://localhost:5062',
        changeOrigin: true,
      },
      // Resim dosyaları da localhost backend'den çekilir
      '/images': {
        target: 'http://localhost:5062',
        changeOrigin: true,
      }
    }
  }
})
