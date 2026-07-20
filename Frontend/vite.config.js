import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // G-10, G-11: /api ile başlayan tüm istekler backend'e yönlendirilir
      // changeOrigin: host header'ı hedef sunucuya göre ayarlanır
      '/api': {
        target: 'http://soru-cozum-production.up.railway.app:8080',
        changeOrigin: true,
      },
      // Resim dosyalarını da backend sunucusundan (wwwroot) çekeriz
      '/images': {
        target: 'http://soru-cozum-production.up.railway.app:8080',
        changeOrigin: true,
      }
    }
  }
})
