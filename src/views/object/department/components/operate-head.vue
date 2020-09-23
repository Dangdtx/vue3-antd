<template>
  <a-card style="margin-bottom: 14px">
      <a-button type="primary" @click="onChange('自动审批', 1)">
        全局设置自动审批
      </a-button>
      <a-button style="margin-left: 14px" type="primary" @click.prevent="onChange('手动审批', 0)">
        全局设置手动审批
      </a-button>
  </a-card>
</template>

<script lang="ts">
import {createVNode, defineComponent} from 'vue'
import {Card, message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import {DeptSetapprove} from "@/api/dept";

export default defineComponent({
  name: "operate-head",
  components: {[Card.name]: Card},
  setup() {

    const onChange = async (title, value) => {

      Modal.confirm({
        title: `确定要将所有人设置成${title}吗?`,
        icon: createVNode(ExclamationCircleOutlined),
        onOk: async () => {
          const result = await DeptSetapprove({deptID: 1, value})
          return new Promise( (resolve, reject) => {
            if (result.Code == 1) {
              message.success('设置成功')
              resolve()
            } else {
              message[result.type](result.message || '设置失败')
              reject()
            }
          }).catch(() => console.log('Oops errors!'));
        }
      })
    }
    return {
      onChange
    }
  }
})
</script>

<style scoped>
</style>
