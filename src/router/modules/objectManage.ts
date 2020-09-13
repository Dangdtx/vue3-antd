import {RouteRecordRaw, RouterView} from 'vue-router'

const routeName = 'object'

const routes: Array<RouteRecordRaw> = [{
    path: '/object',
    name: routeName,
    redirect: '/object/terminal',
    component: RouterView,
    meta: {
        title: '对象管理',
        icon: 'ApartmentOutlined'
    },
    children: [
        {
            path: 'terminal',
            name: `${routeName}-terminal`,
            meta: {
                title: '终端管理',
                icon: 'DesktopOutlined'
            },
            component: () => import('@/views/object/terminal/index.vue'),
            children: [
                {
                    path: '',
                    name: `${routeName}-terminal-list`,
                    meta: {
                        title: '终端列表',
                        icon: 'HomeOutlined'
                    },
                    component: () => import('@/views/object/terminal/list.vue')
                },
                {
                    path: ':pid',
                    name: `${routeName}-terminal-info`,
                    props: true,
                    meta: {
                        title: '终端详情',
                        icon: 'HomeOutlined',
                        hidden: true,
                    },
                    component: () => import('@/views/object/terminal/info.vue')
                },
            ]
        },
        {
            path: 'department',
            name: `${routeName}-department`,
            meta: {
                title: '部门管理',
                icon: 'HomeOutlined'
            },
            component: () => import('@/views/object/department/index.vue'),
            children: [
                {
                    path: '',
                    name: `${routeName}-department-list`,
                    meta: {
                        title: '部门列表',
                        icon: 'HomeOutlined'
                    },
                    component: () => import('@/views/object/department/list.vue')
                },
                {
                    path: ':deptId',
                    name: `${routeName}-department-info`,
                    props: true,
                    meta: {
                        title: '部门详情',
                        hidden: true,
                        icon: 'HomeOutlined'
                    },
                    component: () => import('@/views/object/department/info.vue')
                },
            ]
        },
        {
            path: 'role',
            name: `${routeName}-role`,
            meta: {
                title: '角色管理',
                icon: 'UserOutlined'
            },
            component: () => import('@/views/object/role/index.vue'),
            children: [
                {
                    path: '',
                    name: `${routeName}-role-list`,
                    meta: {
                        title: '角色列表',
                        icon: 'HomeOutlined'
                    },
                    component: () => import('@/views/object/role/list.vue')
                },
                {
                    path: ':uid',
                    name: `${routeName}-role-info`,
                    props: true,
                    meta: {
                        title: '角色详情',
                        hidden: true,
                        icon: 'HomeOutlined'
                    },
                    component: () => import('@/components/user/index.vue')
                },
            ]
        }
    ]
}]

export default routes
