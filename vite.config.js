//vite.config.js
import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // publicPath:"/dist/",
  base:'./',
  build: {
    chunkSizeWarningLimit: 600000, // 调整为 600 kB
    outDir:'docs'
  },
  resolve:{
    alias:{
      "@":path.resolve(__dirname,"src")
    }
  }
})