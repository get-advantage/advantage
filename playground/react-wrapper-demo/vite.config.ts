import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: 'localhost'
  },
  resolve: {
    alias: {
      '@get-advantage/advantage': resolve(__dirname, '../../src/advantage/index.ts'),
      '@get-advantage/advantage/react': resolve(__dirname, '../../src/react/index.ts'),
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
