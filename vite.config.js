import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import eslint from 'vite-plugin-eslint';
import { VitePWA } from 'vite-plugin-pwa';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', { 
            verbose: true 
          }]
        ]
      }
    }),
    !isProduction && eslint({
      lintOnStart: true,
      overrideConfigFile: './.eslintrc.cjs',
      failOnError: false,
      failOnWarning: false,
      cache: true,
    }),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
      include: ['crypto', 'stream', 'util', 'buffer', 'events'],
    }),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      injectManifest: {
        maximumFileSizeToCacheInBytes: 6000000,
      },
      manifest: {
        name: 'plebchan',
        short_name: 'plebchan',
        description: 'A GUI for plebbit similar to 4chan',
        theme_color: '#ffffff',
        background_color: '#ffffee',
        display: 'standalone',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/_\(.*\)/],
        maximumFileSizeToCacheInBytes: 6000000,
        runtimeCaching: [
          // Fix index.html not refreshing on new versions
          {
            urlPattern: ({ url }) => url.pathname === '/' || url.pathname === '/index.html',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'html-cache'
            }
          },
          // PNG caching
          {
            urlPattern: ({ url }) => url.pathname.endsWith('.png'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50
              }
            }
          },
          // Add additional asset caching
          {
            urlPattern: /\.(?:js|css|woff2?|svg|gif|jpg|jpeg)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          // Google Fonts caching
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'node-fetch': 'isomorphic-fetch',
      'assert': 'assert',
      'stream': 'stream-browserify',
      'crypto': 'crypto-browserify',
      'buffer': 'buffer',
    }
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      usePolling: true,
    },
    hmr: {
      overlay: false
    }
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
    sourcemap: process.env.GENERATE_SOURCEMAP === 'true',
    target: process.env.ELECTRON ? 'electron-renderer' : 'modules',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  base: process.env.PUBLIC_URL || '/',
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      define: {
        global: 'globalThis',
      },
    },
    include: [
      'ethers',
      'assert',
      'buffer',
      'process',
      'stream-browserify',
      'isomorphic-fetch'
    ],
  },
  esbuild: {
    target: 'es2020'
  },
  define: {
    'process.env.VITE_COMMIT_REF': JSON.stringify(process.env.COMMIT_REF),
    'global': 'globalThis',
    '__dirname': '""',
  }
});
