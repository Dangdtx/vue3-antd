<template>
  <tool-outlined @click.stop="visible = true"/>
  <a-modal
      v-model:visible="visible"
      centered
      :width="400"
      title="设置默认用户策略"
      ok-text="设置默认策略"
      @ok="handleOk"
  >
    <a-checkbox-group v-model:value="value">
      <a-row>
          <a-col v-for="i in 20" :span="8" :key="i">
            <a-checkbox :value="i">
              {{i}}
            </a-checkbox>
          </a-col>
      </a-row>
    </a-checkbox-group>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {userPolicylist, userSetdefaultpolicy, userGetdefaultpolicy} from '@/api/user'
import {ToolOutlined} from '@ant-design/icons-vue'
import {Modal, Row, Col} from 'ant-design-vue'

export default defineComponent({
  name: "user-policy-button",
  components: {ToolOutlined, [Modal.name]: Modal, [Row.name]: Row, [Col.name]: Col},
  setup() {


    const visible = ref(false)
    const value = ref([])

    userPolicylist({type: 1})
    userGetdefaultpolicy({})

    const handleOk = () => {
      visible.value = false
    }

    return {
      visible,
      value,
      handleOk
    }
  }
})
</script>

<style scoped>
</style>
