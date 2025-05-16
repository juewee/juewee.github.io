import { defineConfig } from 'vite'
import { setupBuild } from './build/index'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  build: setupBuild(),
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.uomg.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/api3': {
        target: 'https://gsv.ai-lab.top', // 目标 API 地址
        changeOrigin: true, // 是否修改 Origin
        rewrite: (path) => path.replace(/^\/api3/, ''), // 去掉 /api 前缀
      },
    },
  },
})
