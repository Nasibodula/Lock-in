import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  server: { proxy: { '/api': 'http://localhost:3000' } },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: { navigateFallbackDenylist: [/^\/api/] },
      manifest: {
        name: 'Lock-in', short_name: 'Lock-in', description: 'Daily habit tracker',
        theme_color: '#14213d', background_color: '#14213d', display: 'standalone',
        start_url: '.', scope: '.',
      icons: [
        { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
        { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
      }
    })
  ]
})
