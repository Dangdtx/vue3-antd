<template>
  <div class="edit-form">
    <a-spin :spinning="spinning">
      <a-form layout="horizontal" :model="form" v-bind="formItemLayout" @submit="handleSubmit" @submit.prevent>
        <a-breadcrumb>
          当前选中：
          <a-breadcrumb-item>{{ selectedNames.name || '---' }}</a-breadcrumb-item>
          <a-breadcrumb-item>{{ selectedNames.type || '---' }}</a-breadcrumb-item>
        </a-breadcrumb>
        <a-divider orientation="left">
          加密选项
        </a-divider>
        <a-form-item label="加密方式">
          <a-radio-group v-model:value="form.type" name="type">
            <a-radio value="0">
              自动加密
            </a-radio>
            <a-radio value="256">
              手动加密
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :colon="false" label="  ">
          <a-checkbox-group v-model:value="form.checks" name="checks">
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
          <a-textarea v-model:value="form.processname" placeholder="进程名称">
          </a-textarea>
        </a-form-item>
        <a-form-item :label="form.checks.includes('128') ? '加密副本' : '扩展名'">
          <a-textarea v-model:value="form.externname" placeholder="扩展名">
          </a-textarea>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 19, offset: 5 }">
          <a-button
              type="primary"
              html-type="submit"
              :disabled="!form.policytype && !form.applicationid"
          >
            添加
          </a-button>
          <a-button @click="delAppPolicy" :disabled="disabled && !processid">
            删除
          </a-button>
          <a-button @click="setAppPolicy" :disabled="disabled && !processid">
            修改
          </a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch, createVNode} from 'vue'

import {Divider, message, Modal, Breadcrumb, Spin} from 'ant-design-vue'
import {appDel, appAdd, appSet, appProc} from '@/api/policy'
import {ExclamationCircleOutlined} from '@ant-design/icons-vue'

interface FormProps {
  processid: string | number;
  disabled: boolean;
  selectedNames?: object;
}

export default defineComponent({
  name: "edit-form",
  components: {
    ADivider: Divider, [Breadcrumb.name]: Breadcrumb, [Breadcrumb.Item.name]: Breadcrumb.Item, [Spin.name]: Spin
  },
  props: {
    processid: {
      type: [Number, String],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selectedNames: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props: FormProps, {emit}) {
    const state = reactive({
      spinning: false, // 加载状态
      selectedNames: {
        type: '',
        name: ''
      },
      form: {
        type: '',
        checks: [] as string[],
        applicationid: '',
        externname: "",
        policytype: "",
        policyname: '',
        policysum: 0,
        processid: props.processid,
        processname: ""
      },
      formItemLayout: {
        labelCol: {span: 5},
        wrapperCol: {span: 19},
      }
    })

    // 获取进程详情
    const getAppProc = async (processid) => {
      if (processid == '') return
      state.spinning = true
      const data = await appProc({id: processid}).finally(() => state.spinning = false)
      // console.log(value, '表单')
      state.form.policyname ??= state.form.policyname
      // console.log(state.form, '表单')
      state.form = {
        ...state.form,
        ...data
      }
      state.form.type = ''
      state.form.processid = processid
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

    watch(() => props.selectedNames, (names: any) => {
      console.log(names, 'names')
      state.selectedNames.type = names.type
      state.selectedNames.name = names.name
      state.form.applicationid = names.applicationid
    })

    watch(() => props.processid, (value: any) => getAppProc(value))

    const delAppPolicy = () => {
      Modal.confirm({
        title: '确定要删除该进程策略吗？',
        centered: true,
        icon: createVNode(ExclamationCircleOutlined),
        okType: 'danger',
        onOk: async () => {
          const res = await appDel({id: state.form.processid})
          console.log(res, '删除结果')
          if (res.Code == 1) {
            message.success('删除成功！')
            emit('delete-row', state.form.processid)
            state.form.processid = ''
          } else {
            message.info(res.message)
          }
        },
      })
    }

    // 添加
    const handleSubmit = async () => {
      const {processid, processname, externname, applicationid, checks, type} = state.form

      const index = checks.findIndex((item: string)  => item == '64')
      // 自动加密并且没有勾选加密副本
      if(index == -1 && type == '0') {
        checks.push('3')
      }
      if (type == '256' && index != -1) {
        checks.splice(index, 1)
      }

      const params = {
        id: applicationid,
        'processname': processname,
        'extension': externname,
        'sum': checks.reduce((acc, curr) => ~~acc + ~~curr, ~~type)
      }
      const res = await appAdd(params)
      if (res.Code == 1) {
        message.success('添加成功！')
        emit('add-row', true)
      } else {
        message.info(res.message)
      }
      console.log(state.form)
    }

    // 修改
    const setAppPolicy = async () => {
      const {processid, processname, externname, checks, type} = state.form
      const index = checks.findIndex((item: string)  => item == '64')
      // 自动加密并且没有勾选加密副本
      if(index == -1 && type == '0') {
        checks.push('3')
      }
      if (type == '256' && index != -1) {
        checks.splice(index, 1)
      }
      const params = {
        'id': processid,
        'processname': processname,
        'extension': externname,
        'sum': checks.reduce((acc, curr) => ~~acc + ~~curr, ~~type)
      }
      const res = await appSet(params)
      if (res.Code == 1) {
        message.success('修改成功！')
        getAppProc(processid)
        emit('edit-row', processid)
      } else {
        message.info(res.message)
      }
    }

    return {
      ...toRefs(state),
      delAppPolicy,
      setAppPolicy,
      handleSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.edit-form {
  ::v-deep(.ant-form) {
    padding: 18px;

    .ant-form-item-label {
      padding-right: 6px;
    }

    .ant-form-item:last-of-type {
      .ant-form-item-children {
        display: flex;
        justify-content: space-around;
      }
    }
  }
}
</style>
