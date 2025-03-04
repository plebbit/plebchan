import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import eslint from 'vite-plugin-eslint';

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
    eslint({
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
    'process.env': {},
    'global': 'globalThis',
    '__dirname': '""',
  }
});
