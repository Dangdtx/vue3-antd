import {RouteRecordRaw} from 'vue-router'
import {RouterTransition} from '@/components/transition'

const routes: Array<RouteRecordRaw> = [{
    path: '/redirect/:path*',
    name: 'Redirect',
    component: () => RouterTransition,
    meta: {
        title: '重定向',
        icon: 'SettingOutlined',
        hidden: true,
    },
    children: [
        {
            path: '',
            name: 'Redirect',
            component: () => import('@/views/redirect/index.vue'),
            meta: {
                title: '重定向',
                hidden: true,
            },
        }
    ]
}]

export default routes
