import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['5173-im4gmk29x38cco9g1hk6r-decd8713.manusvm.computer', '.manusvm.computer'],
  },
})

