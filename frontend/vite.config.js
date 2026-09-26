import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        timeout: 60000,
        proxyTimeout: 60000,

        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('[Vite Proxy Error]', err)
          })
        },
      },
    },
  },
})