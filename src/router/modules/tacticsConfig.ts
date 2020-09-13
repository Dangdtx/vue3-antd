import {RouteRecordRaw, RouterView} from 'vue-router'

const routeName = 'tactics'

const routes: Array<RouteRecordRaw> = [{
    path: '/tactics',
    name: routeName,
    redirect: '/tactics/template',
    component: RouterView,
    meta: {
        title: '策略配置',
        icon: 'EditOutlined'
    },
    children: [
        {
            path: 'template',
            name: `${routeName}-template`,
            meta: {
                title: '策略模板',
                icon: 'UserOutlined'
            },
            component: () => import('@/views/tactics/template/index.vue')
        }
    ]
}]

export default routes
