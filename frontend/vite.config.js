import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

const BASE_URL = 'https://my-vision-board-app.vercel.app'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: BASE_URL,
      generateRobotsTxt: false,
      changefreq: 'daily',
      priority: 0.8,
      dynamicRoutes: [
        '/about',
        '/features',
        '/how-it-works',
        '/privacy-policy',
      ],
      exclude: [
        '/login', 
        '/register', 
        '/dashboard', 
        '/api', 
        '/googlec9f9813d5b3ba05d.html',
        '/googlec9f9813d5b3ba05d',
        '/settings', 
        '/admin', 
        '/account', 
        '/auth'
      ],
    }),
  ],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

