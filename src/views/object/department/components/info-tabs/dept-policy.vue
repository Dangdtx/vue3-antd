<template>
  <div class="client-info">
    <a-form layout="horizontal" :model="form" v-bind="formItemLayout" @submit="handleSubmit" @submit.prevent>
      <a-form-item :label-col="{span: 10}" label-align="left"  :colon="false"
                   :wrapper-col="{span: 14}">
        <template v-slot:label>
          <a-spin :spinning="treeIsLoad" tip="加载中">
            <a-tree
                style="min-height: 200px"
                v-model:checkedKeys="checkedKeys"
                :checkStrictly="checkStrictly"
                checkable
                auto-expand-parent
                treeDefaultExpandAll
                :tree-data="treeData"
                @select="selectedTree"
                @check="checkTreeNode"
            />
          </a-spin>
        </template>
        <div>当前选中：{{ currentSelected }}</div>
        <a-table
            size="small"
            :loading="loading"
            bordered
            :customRow="customRow"
            :columns="columns"
            :data-source="appModules"
            :pagination="false"
            row-key="processid"
            :scroll="{ y: 240 }"
        />
      </a-form-item>
      <a-divider orientation="left">
        加密选项
      </a-divider>
      <a-form-item label="加密方式">
        <a-radio-group v-model:value="form.type" name="type" :disabled="form.policyid == -1">
          <a-radio value="0">
            自动加密
          </a-radio>
          <a-radio value="256">
            手动加密
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :colon="false" label="  ">
        <a-checkbox-group v-model:value="form.checks" name="checks" :disabled="form.policyid == -1">
          <a-checkbox value="128">
            扩展名不匹配禁止加密
          </a-checkbox>
          <a-checkbox :disabled="form.type == 256" value="64">
            使用加密副本
          </a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-divider orientation="left">
        进程属性
      </a-divider>
      <a-form-item label="进程名称">
        <a-textarea v-model:value="form.processname" disabled placeholder="进程名称">
        </a-textarea>
      </a-form-item>
      <a-form-item :label="form.checks.includes(128) ? '加密副本' : '扩展名'">
        <a-textarea v-model:value="form.processextern" disabled placeholder="扩展名">
        </a-textarea>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 19, offset: 5 }">
        <a-button
            type="primary"
            html-type="submit"
            :disabled="!isSelectedTableItem || form.processname == '' && form.applicationid == ''"
        >
          保存修改
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs, nextTick} from 'vue'
import {Divider, Tree, Spin, message} from 'ant-design-vue'
import {deptPolicy,DeptProclist,DeptPolicyList, deptModuleList, deptModule, deptChangeprocess, appByModule, deptProc, deptSetpolicy} from "@/api/dept";

export default defineComponent({
  name: "dept-policy",
  components: {[Divider.name]: Divider, [Tree.name]: Tree, [Spin.name]: Spin},
  setup(props, {attrs}) {

    const state = reactive({
      checkedKeys: [] as any[],
      treeData: [],
      currentSelected: '',
      isSelectedTableItem: false,
      appModules: [],
      checkStrictly: true, // 是否受控
      loading: false,
      treeIsLoad: false, // 树加载状态
      form: {
        type: '',
        checks: [] as string[],
        applicationid: '',
        classid: '',
        departmentid: '',
        policyid: '',
        policysum: 0,
        processextern: "",
        processid: '',
        processname: ""
      },
      formItemLayout: {
        labelCol: {span: 5},
        wrapperCol: {span: 19},
      }
    })

    let applicationid = ''

    const columns = [
      {
        title: '进程名',
        dataIndex: 'processname'
      },
      {
        title: '扩展名',
        dataIndex: 'externname'
      }
    ]

    // 获取到真实的key
    const getKey = (nodeKey) => nodeKey.replace(/appid-|classid-/g, '')

    onMounted(async () => {
      state.treeIsLoad = true
      // 部门策略中policy列表
      const policyList = await DeptPolicyList({deptID: attrs.deptId})
      // 部门策略已选中的policy列表
      const policy = await deptPolicy({deptID: attrs.deptId})
      // 部门策略中已选中的module列表
      const module = await deptModule({deptID: attrs.deptId})
      // const result = await deptIdPolicy({}, attrs.deptId).finally(() => state.treeIsLoad = false)

      // 选中的
      const moduleSelected = module.map(item => 'appid-' + item.applicationid)
      const policySelected = policy.map(item => 'classid-' + item.classid)

      state.checkedKeys = [...moduleSelected, ...policySelected]
      console.log(state.checkedKeys, '嗯哼 ')
      const promises = policyList.map(async item => {
        const obj = {
          title: item.classname + item.classid,
          key: 'classid-' + item.classid,
          children: []
        }
        const modules = await deptModuleList({policy: item.classid ,deptID: attrs.deptId})
        obj.children = modules.map(n => ({
          title: n.applicationname + n.applicationid,
          key: 'appid-' + n.applicationid,
        }))
        return obj
      })
      const arr: any = await Promise.allSettled(promises).finally(() => state.treeIsLoad = false)
      state.treeData = arr.filter(item => item.status == "fulfilled").map(item => item.value)
    })

    const getAppModule = async (applicationid) => {
      state.loading = true
      const result = await DeptProclist({module : applicationid, deptID: attrs.deptId}).finally(() => state.loading = false)
      state.appModules = result
    }

    // 选择树节点
    const selectedTree = (selectedKeys, info) => {
      const {node} = info
      state.isSelectedTableItem = false
      state.form.processid = ''
      if (node.pos.split('-').length > 2) {
        state.currentSelected = node.vcTreeNode.dataRef.title + '-->' + node.dataRef.title
        applicationid = node.eventKey.replace(/appid-|classid-/g, '')
        getAppModule(applicationid)
      }
    }
    // 选择树节点
    const checkTreeNode = (checkedKeys, info) => {
      const {node} = info
      const params = {
        "id": node.eventKey.replace(/appid-|classid-/g, ''),
        "type": node.pos.split('-').length > 2 ? 'module' : 'policy',
        "deptID":attrs.deptId,
        "param": !node.checked
      }
      if (node.eventKey.includes('appid')) {
        console.log(node.vcTreeNode, 'node.vcTreeNode')
        if (!node.checked && !node.vcTreeNode.checked) {
          (Array.isArray(state.checkedKeys) ? state.checkedKeys : (state.checkedKeys as any).checked).push(node.vcTreeNode.eventKey)
          // node.vcTreeNode.checked = true
          const params = {
            "id": getKey(node.vcTreeNode.eventKey),
            "type": 'policy',
            "deptID":attrs.deptId,
            "param": true
          }
          deptSetpolicy(params)
        }
      }
      console.log(node, '节点')
      // state.checkedKeys = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked
      if (node.eventKey.includes('classid')) {
        // 如果选中
        if (!node.checked) {
          node.children.forEach(item => item.checked = true)
          const keys = node.children.map(item => item.key)
          Array.isArray(state.checkedKeys) ? state.checkedKeys.push(...keys) :  (state.checkedKeys as any).checked.push(...keys)
          // state.checkStrictly = false
          keys.forEach(key => {
            const params = {
              "id": key.replace(/appid-|classid-/g, ''),
              "type": 'module',
              "deptID":attrs.deptId,
              "param": !node.checked
            }
            deptSetpolicy(params)
          })
        } else {
          node.children.forEach(item => item.checked = false)
          const keys = node.children.map(item => item.key)
          state.checkedKeys = Array.isArray(state.checkedKeys) ? state.checkedKeys.filter(key => !keys.includes(key)) :  (state.checkedKeys as any).checked.filter(key => !keys.includes(key))
          // state.checkStrictly = false
          keys.forEach(key => {
            const params = {
              "id": getKey(key),
              "type": 'module',
              "deptID":attrs.deptId,
              "param": !node.checked
            }
            deptSetpolicy(params)
          })
        }
      }
      deptSetpolicy(params)
    }

    const getDeptProc = async (processid) => {
      const result = await deptProc({id: processid, deptID: attrs.deptId})
      state.form = {
        ...state.form,
        ...result
      }
      state.form.type = ''
      state.form.checks = []
      state.form.type = (256 & state.form.policysum) == 0 ? '0' : '256'
      if (state.form.type == '0') { // 自动加密
        if (0 != (64 & state.form.policysum)) { // 加密副本
          !state.form.checks.includes('64') && state.form.checks.push('64')
        }
      }
      if (0 != (128 & state.form.policysum)) { // 扩展名不匹配禁止加密
        !state.form.checks.includes('128') && state.form.checks.push('128')
      }
    }

    // 提交修改
    const handleSubmit = async () => {
      const {processid, checks, type} = state.form
      const index = checks.findIndex((item: string)  => item == '64')
      // 自动加密并且没有勾选加密副本
      if(index == -1 && type == '0') {
        checks.push('3')
      }
      if (type == '256' && index != -1) {
        checks.splice(index, 1)
      }
      const params = {
        "process": processid,
        "department": attrs.deptId,
        "sum": checks.reduce((acc, curr) => acc + ~~curr, ~~type)
      }
      await deptChangeprocess(params)
      getAppModule(applicationid)
      console.log(state.form)
    }

    const customRow = record => ({
      class: {
        click: state.form.processid == record.processid
      },
      onclick: async e => {
        e.preventDefault();
        e.stopPropagation()
        state.isSelectedTableItem = true
        getDeptProc(record.processid)
      }
    })

    return {
      ...toRefs(state),
      columns,
      customRow,
      checkTreeNode,
      selectedTree,
      handleSubmit,
      getDeptProc
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep(.click) > td {
  background-color: #e6f7ff;
}
</style>
