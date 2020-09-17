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
                :checkStrictly="true"
                checkable
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
          <a-radio :value="0">
            自动加密
          </a-radio>
          <a-radio :value="256">
            手动加密
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :colon="false" label="  ">
        <a-checkbox-group v-model:value="form.checks" name="checks" :disabled="form.policyid == -1">
          <a-checkbox :value="64">
            扩展名不匹配禁止加密
          </a-checkbox>
          <a-checkbox :disabled="form.type == 256" :value="128">
            使用加密副本
          </a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-divider orientation="left">
        进程属性
      </a-divider>
      <a-form-item label="进程名称">
        <a-textarea v-model:value="form.processname" placeholder="进程名称">
        </a-textarea>
      </a-form-item>
      <a-form-item :label="form.checks.includes(128) ? '加密副本' : '扩展名'">
        <a-textarea v-model:value="form.processextern" placeholder="扩展名">
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
import {defineComponent, onMounted, reactive, toRefs} from 'vue'
import {Divider, Tree, Spin, message} from 'ant-design-vue'
import {deptPolicy,deptIdPolicy, moduleModules, deptModule, deptChangeprocess, appByModule, deptProc, deptSetpolicy} from "@/api/dept";

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
      loading: false,
      treeIsLoad: false, // 树加载状态
      form: {
        type: -1,
        checks: [] as number[],
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

    onMounted(async () => {
      state.treeIsLoad = true
      const module = await deptModule({deptID: attrs.deptId})
      const policy = await deptPolicy({deptID: attrs.deptId})
      const modules = await moduleModules({})
      const result = await deptIdPolicy({}, attrs.deptId).finally(() => state.treeIsLoad = false)

      // 选中的
      const moduleSelected = module.map(item => item.applicationid)
      const policySelected = module.map(item => item.classid)

      state.checkedKeys = [...moduleSelected, ...policySelected]
      state.treeData = result.map(item => {
        const obj = {
          title: item.classname,
          key: item.classid,
          children: []
        }
        const children = modules.filter(n => n.classid == item.classid)
        obj.children = children.map(n => ({
          title: n.applicationname,
          key: n.applicationid,
        }))
        return obj
      })
    })

    const getAppModule = async (applicationid) => {
      state.loading = true
      const result = await appByModule({id: applicationid}).finally(() => state.loading = false)
      state.appModules = result
    }

    // 选择树节点
    const selectedTree = (selectedKeys, info) => {
      const {node} = info
      state.isSelectedTableItem = false
      state.form.processid = ''
      if (node.pos.split('-').length > 2) {
        state.currentSelected = node.vcTreeNode.dataRef.title + '-->' + node.dataRef.title
        applicationid = node.dataRef.key
        getAppModule(applicationid)
      }
    }
    // 选择树节点
    const checkTreeNode = (checkedKeys, info) => {
      const {node} = info
      const params = {
        "id": node.dataRef.key,
        "type": node.pos.split('-').length > 2 ? 'module' : 'policy',
        "deptID":attrs.deptId,
        "param": !node.checked
      }
      deptSetpolicy(params)
    }

    const getDeptProc = async (processid) => {
      const result = await deptProc({id: processid, deptID: attrs.deptId})
      state.form = {
        ...state.form,
        ...result
      }
      state.form.type = -1
      state.form.checks = []
      state.form.type = 0 == (256 & state.form.policysum) ? 0 : 256
      if (state.form.type == 256) {
        if (0 != (64 & state.form.policysum)) {
          !state.form.checks.includes(64) && state.form.checks.push(64)
        }
      }
      if (0 != (128 & state.form.policysum)) {
        !state.form.checks.includes(128) && state.form.checks.push(128)
      }
    }

    // 提交修改
    const handleSubmit = async () => {
      const {processid, checks, type} = state.form

      const params = {
        "process": processid,
        "department": attrs.deptId,
        "sum": checks.reduce((acc, curr) => acc + ~~curr, ~~type)
      }
      const res = await deptChangeprocess(params)
      if (res.Code == 1) {
        message.success('修改成功！')
      } else {
        message.info(res.message)
      }
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
        getDeptProc( record.processid)
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
