/// <reference types="vitest" />

// import {defineConfig} from "vitest/config"

import path from 'path'

// import react from '@vitejs/plugin-react'

export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  
}

// export default defineConfig({
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src')
//     },
//   },
//   plugins: [react()],
//   test: {
//     environment: 'jsdom',
//   },
// })

