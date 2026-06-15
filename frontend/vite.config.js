import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    // sockjs-client references Node.js `global`; replace with browser-native globalThis at build time
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api':        path.resolve(__dirname, './src/api'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks':      path.resolve(__dirname, './src/hooks'),
      '@pages':      path.resolve(__dirname, './src/pages'),
      '@store':      path.resolve(__dirname, './src/store'),
      '@utils':      path.resolve(__dirname, './src/utils'),
      '@assets':     path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
