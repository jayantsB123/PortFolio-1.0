import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/path/to/your/project/src',
      'react-dancing-lines': 'path/to/react-dancing-lines/index.js'  // Adjust this path as necessary
    },
  },
})