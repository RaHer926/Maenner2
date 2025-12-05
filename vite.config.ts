import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['5173-isuxbextlcegl3nbiqmpg-5ea31a41.manus-asia.computer', '.manus-asia.computer', '.manusvm.computer'],
  },
})

