<template>
  <a-table bordered
           :scroll="{y: 'calc(100vh - 210px)'}"
           :columns="columns"
           :loading="loading"
           :pagination="false"
           rowKey="id"
           :data-source="dataList">
    <template #mac="{text, record}">
      {{ record.pid.slice(-12) }}
    </template>
    <template v-slot:cname="{text, record}">
      <router-link :to="`/object/role/${record.id}`">{{ record.cname }}</router-link>
    </template>
    <template v-slot:username="{text, record}">
      <router-link :to="`/object/role/${record.id}`">{{ record.username }}</router-link>
    </template>
    <template #userpri="{text, record}">
      <router-link :to="`/object/department/${record.depid}`">{{ record.userpri }}</router-link>
    </template>
    <template v-slot:roleid="{text, record}">
      {{ formatRole(record.roleid) }}
    </template>
    <template v-slot:actions="{text, record}">
      <div class="actions">
        <a @click="editUser(record)">修改</a>
        <a-popconfirm
            :title="selectedDeptId == 1 ? '用户将会被删除，是否继续？' : '用户将会变成普通用户，是否继续？'"
            placement="leftTop"
            @confirm="confirmRemove(record)"
        >
          <a>移出</a>
        </a-popconfirm>
      </div>
    </template>
  </a-table>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch} from 'vue';

import {message, Popconfirm} from 'ant-design-vue'

import SplitPanel from '@/components/split-panel/index.vue'

import {useEventbus} from '@/hooks/useEventbus'

import {userRoleuser, userRemovefromrole, userDelete} from '@/api/user'
import {useUserEdit} from '../modals/useModals'

const temColumns = [
  {
    title: '用户名',
    dataIndex: 'cname',
    slots: {customRender: 'cname'}
  },
  {
    title: '账号',
    dataIndex: 'username',
    slots: {customRender: 'username'}
  },
  {
    title: '所在部门',
    dataIndex: 'userpri',
    slots: {customRender: 'userpri'}
  },
  {
    title: '角色',
    dataIndex: 'roleid',
    slots: {customRender: 'roleid'}
  },
  {
    title: '操作',
    dataIndex: 'actions',
    width: 100,
    slots: {customRender: 'actions'}
  }
]

export default defineComponent({
  name: 'table-data',
  components: {SplitPanel, [Popconfirm.name]: Popconfirm},
  props: {
    getDataMethod: {
      type: Function,
      default: userRoleuser
    },
    selectedDeptId: {
      type: [String, Number],
      default: 0
    }
  },
  setup(props) {
    const state = reactive({
      loading: false,
      currentUid: 0,
      dataList: [],
    })
    const columns: Array<any> = temColumns

    const {refreshTable} = useEventbus()

    const getTableData = async (id) => {
      state.loading = true
      const data = await props.getDataMethod({type: id}, id).finally(() => state.loading = false)
      console.log(data, '表格数据')
      state.dataList = data
    }

    const formatRole = (roleid) => ({
      1: '普通用户',
      2: '控制台管理员',
      4: '分级管理员',
      8: '特权用户'
    }[roleid])

    refreshTable(() => getTableData(props.selectedDeptId))

    getTableData(props.selectedDeptId)

    // 监听点击树传过来的id
    watch(() => props.selectedDeptId, value => {
      console.log(value, '收到了')
      getTableData(value)
    })

    // 确认移出
    const confirmRemove = async (record) => {
      const params = {
        ID: record.id
      }
      let result: any = null
      if (props.selectedDeptId == 1) {
        result = await userDelete(params)
      } else {
        result = await userRemovefromrole(params)
      }
      if (result && result.Code === 1) {
        message.success('操作成功')
      } else if (result) {
        message[result.type](result.message || '操作失败')
      }
    }

    // 卸载
    const delDept = async (record) => {
      console.log(record)
    }

    // 修改用户
    const editUser = (record) => {
      console.log(record, '修改用户')
      useUserEdit({userInfo: record})
    }

    const closeInfo = () => {
      getTableData(props.selectedDeptId)
    }


    return {
      ...toRefs(state),
      columns,
      editUser,
      confirmRemove,
      formatRole,
      closeInfo,
      delDept,
    }
  },
});

</script>

<style lang="scss" scoped>
.table-title {
  margin: 0.5em;
}
.actions {
  display: flex;
  justify-content: space-between;
}
</style>
