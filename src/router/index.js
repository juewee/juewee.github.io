import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
import { createWebHistory, createRouter,createWebHashHistory } from 'vue-router'

const routes = [
    { path:'/',component:()=>import("@/layout/index.vue")},
    { path:'/tools',component:()=>import("@/views/tools/index.vue")},
    { path:'/test',component:()=>import("@/views/test/index.vue")},
    //{{...}}
]

const router = createRouter({
  // history: createWebHistory(),
  history:createWebHashHistory(),
  routes,
})

//导航守卫
router.beforeEach((to, from, next) => {
/**
 * to:前往的路由
 * from:原路由
 * next:放行或去往指定路径
 */
    next()
})

export default router