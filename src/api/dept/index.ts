import http from '@/utils/http/axios';

enum Api {
    DeptTree = '/dept/tree',
    DeptSub = '/dept/sub',
    DeptNew = '/dept/new',
    DeptDel = '/dept/delete',
    DeptUpdate = '/dept/update',
    DeptModule = '/dept/module',
    DeptPolicy = '/dept/policy',
    DeptProc = '/dept/proc',
    ModuleModules = '/module/modules',
    deptSetpolicy = '/dept/setpolicy',
    AppByModule = '/app/bymodule',
    DeptChangeprocess = '/dept/changeprocess',
}

/**
 * @description: 获取部门树
 */
export function deptTree(params: any) {
    return http.request({
        url: Api.DeptTree,
        method: 'POST',
        params,
    });
}
/**
 * @description: 获取子部门
 */
export function deptSub(params: any) {
    return http.request({
        url: Api.DeptSub,
        method: 'POST',
        params,
    });
}
/**
 * @description: 部门成员列表
 */
export function deptUsers(params: any, deptID) {
    return http.request({
        url: `/dept/d${deptID}/users`,
        method: 'POST',
        params,
    });
}
/**
 * @description: 获取子部门
 */
export function deptPolicy(params: any) {
    return http.request({
        url: Api.DeptPolicy,
        method: 'POST',
        params,
    });
}
/**
 * @description: 部门策略-获取子部门
 */
export function moduleModules(params: any) {
    return http.request({
        url: Api.ModuleModules,
        method: 'POST',
        params,
    });
}
/**
 * @description: 部门策略-进程模块
 */
export function deptModule(params: any) {
    return http.request({
        url: Api.DeptModule,
        method: 'POST',
        params,
    });
}
/**
 * @description: 部门策略-保存修改
 */
export function deptChangeprocess(params: any) {
    return http.request({
        url: Api.DeptChangeprocess,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 部门策略-实时修改
 */
export function deptSetpolicy(params: any) {
    return http.request({
        url: Api.deptSetpolicy,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 部门策略-当前进程
 */
export function appByModule(params: any) {
    return http.request({
        url: Api.AppByModule,
        method: 'POST',
        params,
    });
}
/**
 * @description: 部门策略-部门进程
 */
export function deptProc(params: any) {
    return http.request({
        url: Api.DeptProc,
        method: 'POST',
        params,
    });
}
/**
 * @description: 新建部门
 */
export function deptNew(params: any) {
    return http.request({
        url: Api.DeptNew,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 删除部门
 */
export function deptDel(params: any) {
    return http.request({
        url: Api.DeptDel,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 部门详情
 */
export function deptInfo(params: any, deptId) {
    return http.request({
        url: `/dept/d${deptId}/base`,
        method: 'POST',
        params,
    });
}
/**
 * @description: 部门策略
 */
export function deptIdPolicy(params: any, deptId) {
    return http.request({
        url: `/dept/d${deptId}/policy`,
        method: 'POST',
        params,
    });
}
/**
 * @description: 成员组成
 */
export function deptIdMember(params: any, deptId) {
    return http.request({
        url: `/dept/d${deptId}/member`,
        method: 'POST',
        params,
    });
}
/**
 * @description: 子部门列表
 */
export function deptIdMemberList(params: any, deptId) {
    return http.request({
        url: `/dept/d${deptId}/memberlist`,
        method: 'POST',
        params,
    });
}
/**
 * @description: 更新部门基本信息
 */
export function deptUpdate(params: any) {
    return http.request({
        url: Api.DeptUpdate,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
