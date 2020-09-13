<template>
  <a-table
           style="min-height: 215px;border-bottom: 1px solid #f0f0f0;"
           :bordered="true"
           size="middle"
           :pagination="false"
           :scroll="{y: 200}"
           :customRow="customRow"
           :columns="columns"
           :loading="loading"
           rowKey="processid"
           :data-source="dataList">
    <template v-slot:options="{text, record}">
      <span>{{ formatOptions(record) }}</span>
    </template>
  </a-table>
  <edit-form :form-data="formData" :disabled="!isSelectedTableItem" @edit-row="editRow" @delete-row="deleteRow" @add-row="addRow" v-bind="$attrs"/>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch} from 'vue';

import EditForm from './edit-form.vue'

import {appBymodule, appProc} from '@/api/policy'

const temColumns = [
  {
    title: '进程名',
    dataIndex: 'processname',
    key: 'processname',
    scopedSlots: {customRender: 'processname'}
  },
  {
    title: '扩展名',
    dataIndex: 'externname',
    key: 'externname'
  },
  {
    title: '策略选项',
    dataIndex: 'options',
    key: 'options',
    slots: {customRender: 'options'}
  }
]

interface ComponentProps {
  selectedId: string | number;
}

export default defineComponent({
  name: 'table-data',
  components: {EditForm},
  props: {
    selectedId: {
      type: [String, Number]
    }
  },
  setup(props: ComponentProps) {
    const columns: Array<any> = temColumns
    const state = reactive({
      loading: false,
      isSelectedTableItem: false,
      dataList: [],
      formData: {
        processid: ''
      },
    })

    const getAppByModule = async (id) => {
      const data = await appBymodule({id}).finally(() => state.loading = false)
        state.dataList = data
        state.formData = {
          processid: ''
        }
    }

    const formatOptions = (record) => {
      const policyOptions = {
        0: '自动加密',
        256: '手动加密',
        64: '扩展名不匹配禁止加密',
        128: '使用副本加密',
      }
      const arr: string[] = []
      if (0==(256&record.policysum)) {
        arr.push(policyOptions[0])
      } else {
        arr.push(policyOptions[256])
        if(0!=(64&record.policysum)){
          arr.push(policyOptions[64])
        }
      }
      if(0!=(128&record.policysum)){
        arr.push(policyOptions[128])
      }
      return arr.join('|')
    }

    watch(() => props.selectedId,  value => {
      state.loading = true
      console.log(value, '收到了')
      state.isSelectedTableItem = false
      state.formData.processid = ''
      getAppByModule(value)
    })

    const getAppProc = async (processid) => {
      const data = await appProc({id: processid})
      state.formData = data
    }

    const customRow = record => ({
      class: {
        click: state.formData.processid == record.processid
      },
      onclick: async e => {
        e.preventDefault();
        e.stopPropagation()
        state.isSelectedTableItem = false
        console.log(record, '点击的表格')
        state.formData.processid = record.processid
        getAppProc(record.processid)
      }
    })

    const addRow = (res: boolean) => {
      if (res) {
        state.formData.processid = ''
        getAppByModule(props.selectedId)
      }
    }

    const deleteRow = (processid) => getAppByModule(props.selectedId)

    const editRow = (processid) => getAppProc(processid)

    return {
      ...toRefs(state),
      columns,
      formatOptions,
      customRow,
      deleteRow,
      addRow,
      editRow,
    }
  },
});

</script>

<style lang="scss" scoped>
::v-deep(.click) > td {
  background-color: #e6f7ff;
}
</style>
