import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    "host": "0.0.0.0",
    "allowedHosts": ["adiron.com"],
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:9090',
        changeOrigin: true,
        rewrite: (path : string) => path.replace(/^\/api/, ''),
      },
    },
  },

})
