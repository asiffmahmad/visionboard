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
        '/contact',
        '/blog',
        '/blog/best-habit-tracker-for-daily-productivity',
        '/blog/how-to-build-habits-that-actually-stick',
        '/blog/vision-boards-vs-goal-setting',
        '/blog/why-streak-tracking-increases-motivation',
        '/blog/daily-planning-techniques-for-personal-growth',
        '/blog/how-to-stay-consistent-with-your-goals',
        '/use-case/habit-tracker-for-students',
        '/use-case/habit-tracker-for-developers',
        '/use-case/habit-tracker-for-weight-loss',
        '/use-case/habit-tracker-for-adhd',
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
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    sourcemap: true,
  }
})

