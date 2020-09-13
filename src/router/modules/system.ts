import {RouteRecordRaw, RouterView} from 'vue-router'

const routeName = 'system'

const routes: Array<RouteRecordRaw> = [{
    path: '/system',
    name: routeName,
    redirect: '/system/secretKey',
    component: RouterView,
    meta: {
        title: '系统管理',
        icon: 'SettingOutlined'
    },
    children: [
        {
            path: 'secretKey',
            name: `${routeName}-secretKey`,
            meta: {
                title: '秘钥管理',
                icon: 'DesktopOutlined'
            },
            component: () => import('@/views/system/secretKey/index.vue')
        }
    ]
}]

export default routes
