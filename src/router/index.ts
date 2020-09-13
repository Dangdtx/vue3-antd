import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import objectManage from './modules/objectManage'
import tacticsConfig from './modules/tacticsConfig'
import system from './modules/system'
import redirect from './modules/redirect'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Layout',
        redirect: '/object/terminal',
        component: import('@/layout/index.vue'),
        meta: {
          title: '首页'
        },
        children: [...objectManage, ...tacticsConfig, ...system, ...redirect]
    },
    {
       path: '/login',
       name: 'login',
       component: () => import('@/views/login/index.vue')
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/',
    }
]

const router = createRouter({
    // process.env.BASE_URL
    history: createWebHashHistory('index/index'),
    routes
})

export default router
