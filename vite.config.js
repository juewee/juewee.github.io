//vite.config.js
import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import { setupBuild } from './build/index'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // publicPath:"/dist/",
  base:'./',
  build: setupBuild(),
  resolve:{
    alias:{
      "@":path.resolve(__dirname,"src")
    }
  }
})