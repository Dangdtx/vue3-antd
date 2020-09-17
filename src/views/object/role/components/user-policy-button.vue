<template>
  <tool-outlined @click.stop="visible = true"/>
  <a-modal
      v-model:visible="visible"
      centered
      :width="400"
      :confirm-loading="loading"
      title="设置默认用户策略"
      ok-text="设置默认策略"
      @ok="handleOk"
  >
    <a-spin :spinning="spinning">
      <div style="min-height: 150px">
        <a-checkbox-group v-model:value="checkeds">
          <a-row>
            <a-col v-for="item in policyList" :span="8" :key="item.id">
              <a-checkbox :value="item.policy">
                {{ item.caption }}
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </div>
    </a-spin>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, inject, watch} from 'vue'
import {userPolicylist, userSetdefaultpolicy, userGetdefaultpolicy} from '@/api/user'
import {ToolOutlined} from '@ant-design/icons-vue'
import {Modal, Row, Col, Spin, message} from 'ant-design-vue'

export default defineComponent({
  name: "user-policy-button",
  components: {ToolOutlined, [Modal.name]: Modal, [Row.name]: Row, [Col.name]: Col, [Spin.name]: Spin},
  setup() {
    const state = reactive({
      visible: false,
      loading: false,
      spinning: true,
      checkeds: [],
      policyList: []
    })

    watch(() => state.visible, async value => {
      if (value) {
        const list = await userPolicylist({})
        state.policyList = list
        state.spinning = false
        const checkArr = await userGetdefaultpolicy({})
        state.checkeds = checkArr
      }
    })

    const handleOk = async () => {
      state.loading = true
      let sum = 0
      state.checkeds.forEach(policy => sum += ~~policy)
      const result = await userSetdefaultpolicy({policy: sum}).finally(() => state.loading = false)
      if (result.Code == 1) {
        message.success('设置成功')
      } else {
        message[result.type](result.message || '操作失败')
      }
      state.visible = false
    }

    return {
      ...toRefs(state),
      handleOk
    }
  }
})
</script>

<style scoped>
</style>
