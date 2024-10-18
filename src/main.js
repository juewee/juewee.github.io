import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' //导入router
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'//图表
import { createPinia } from 'pinia';
import '@/components/script.js';
const app = createApp(App)

// 注册 Element Plus 的图标组件
for (const [name, comp] of Object.entries(ElementPlusIconsVue)) {
    app.component(name, comp);
  }
  app.use(ElementPlus)
  app.use(createPinia());
  app.use(router)
  app.mount('#app')