import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png'
      ],
      manifest: {
        name: 'Kukhoma Outreach Tracker',
        short_name: 'Outreach',
        description: 'Offline-ready Outreach Module for The Kukhoma Project',
        theme_color: '#0d9488',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          // Cache pages and navigation
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
            },
          },
          // Cache static assets (JS, CSS, images)
          {
            urlPattern: /.*\.(?:js|css|png|jpg|jpeg|svg|html)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
            },
          },
          // Cache Firebase requests when offline (optional)
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkOnly',
            options: {
              cacheName: 'firebase-cache',
            },
          },
        ],
      },
    }),
  ],
})
